
import { cloneDeep, merge } from 'lodash'
import editorProjectConfig from '@client/pages/editor/DataModel'

/**
 * 编辑器数据状态存储
 */
const state = {
	// 当前编辑器编辑工程项目数据
	projectData: {

	},
	// 当前正在编辑的页面uuid
	activePageUUID: '',
	// 画板中选中的元素uuid
	activeElementUUID: '',
	// 历史操作数据用于undo redo
	historyCache: [],
	// redo undo 指针
	currentHistoryIndex: -1,
	activeAttrEditCollapse: ['1']


};
const actions = {
	/**
	 * 初始化编辑项目数据
	 * @param state
	 * @param data
	 */
	setPrjectData({commit, state, dispatch}, data){
		let projectData = data;
		if(!projectData){
			projectData = editorProjectConfig.getProjectConfig()
		}
		commit('setPrjectData', projectData);
		// 判断如果有页面择选中第一个没有则新建一个页面再选中第一个
		if(!state.projectData.pages || !state.projectData.pages.length){
			dispatch('addPage')
		}
		dispatch('setActivePageUUID', state.projectData.pages[0].uuid)
	},
	/**
	 * 设置当前选中页面uuid
	 * @param state
	 * @param data
	 */
	setActivePageUUID({commit}, uuid){
		commit('setActivePageUUID', uuid);
		// 当前选中页面切换后清空元素选中的uuid
		commit('setActiveElementUUID', '');
	},
	/**
	 * 设置当前选中激活元素uuid
	 * @param state
	 * @param data
	 */
	setActiveElementUUID({commit}, uuid){
		commit('setActiveElementUUID', uuid);
	},
	// ========================项目操作=========================
	/**
	 *
	 * @param commit
	 * @param url
	 */
	updateCoverImage({commit}, url){
		commit('updateCoverImage', url)
	},

	// =====================页面操作============================
	/**
	 * 添加页面
	 * @param commit
	 */
	addPage({commit}, uuid){
		let data = editorProjectConfig.getPageConfig()
		let index = -1;
		if(uuid){
			index = state.projectData.pages.findIndex(v => {return v.uuid === uuid})
		}else{
			index = state.projectData.pages.length -1;
		}
		commit('insertPage', data, index);
		commit('addHistoryCache')
	},
	/**
	 * 删除页
	 * @param commit
	 * @param dispatch
	 * @param uuid
	 */
	deletePage({state, commit, dispatch}, uuid){
		// 如果删除最后一页
		if((state.projectData.pages.length === 1) && state.activePageUUID === uuid){
			dispatch('addPage')
			commit('setActivePageUUID', state.projectData.pages[1].uuid);
			commit('deletePage', index)
			commit('addHistoryCache')
			return;
		}
		// 删除页是第一页且选中也是第一页时 先将选中uuid置为下一页再删除当前页
		if(state.projectData.pages[0] === uuid && state.activePageUUID === uuid){
			commit('setActivePageUUID', state.projectData.pages[1].uuid);
		}
		let index = state.projectData.pages.findIndex(v => {return v.uuid === uuid})
		commit('deletePage', index)
		commit('addHistoryCache')
	},
	/**
	 * 复制页面
	 * @param commit
	 * @param uuid
	 */
	copyPage({commit}, uuid){
		let pageData = state.projectData.pages.find(v => {return v.uuid === uuid})
		let data = editorProjectConfig.copyPage(pageData)
		commit('insertPage', data)
		commit('addHistoryCache')
	},

	// =============================元素相关========================================

	/**
	 * 添加元素
	 * @param commit
	 * @param data
	 */
	addElement({commit}, elData){
		let activePage = getters.activePage(state)
		let data = editorProjectConfig.getElementConfig(elData, {zIndex: activePage.elements.length + 1})
		commit('addElement', data);
		commit('setActiveElementUUID', data.uuid)
		commit('addHistoryCache')
	},
	/**
	 * 元素指令， 用于结束针对元素修改相关指令，再由此方法派发actions做具体修改
	 * @param dispatch
	 * @param type
	 * @param data
	 */
	elementCommand({commit, dispatch, state}, command){
		let elData = getters.activeElement(state)
		switch (command) {
			case 'copy':
				dispatch('copyElement', elData)
				break;
			case 'delete':
				dispatch('deleteElement', elData.uuid)
				break;
			case 'fontA+':
				dispatch('resetElementCommonStyle', {fontSize: elData.commonStyle.fontSize + 1})
				break;
			case 'fontA-':
				dispatch('resetElementCommonStyle', {fontSize: elData.commonStyle.fontSize - 1})
				break;
			case 'fontB':
				dispatch('resetElementCommonStyle', {fontWeight: elData.commonStyle.fontWeight === 'bold' ? 'normal' : 'bold'})
				break;
			case 'layerUp':
				commit('resetElementZIndex', {uuid: elData.uuid, type: 'layerUp'})
				commit('addHistoryCache')
				break;
			case 'layerDown':
				commit('resetElementZIndex', {uuid: elData.uuid, type: 'layerDown'})
				commit('addHistoryCache')
				break;
			case 'layerTop':
				commit('resetElementZIndex', {uuid: elData.uuid, type: 'layerTop'})
				commit('addHistoryCache')
				break;
			case 'layerBottom':
				commit('resetElementZIndex', {uuid: elData.uuid, type: 'layerBottom'})
				commit('addHistoryCache')
				break;
			default:
				break;
		}
	},
	copyElement({state, commit}, elData){
		let copyOrignData = elData ? elData : getters.activeElement(state)
		let activePage = getters.activePage(state)
		let data = editorProjectConfig.copyElement(copyOrignData, {zIndex: activePage.elements.length + 1})
		commit('addElement', data);
		commit('setActiveElementUUID', data.uuid)
		commit('addHistoryCache')
	},
	deleteElement({state, commit}, uuid){
		// 如果删除选中元素则取消元素选中
		if(uuid === state.activeElementUUID){
			commit('setActiveElementUUID', '')
		}
		// 先将页面元素zIndex 重置下再删除元素
		commit('resetElementZIndex', {uuid: uuid, type: 'set0'})

		commit('deleteElement', uuid)
		commit('addHistoryCache')
	},
	resetElementCommonStyle({commit}, style){
		commit('resetElementCommonStyle', style)
		commit('addHistoryCache')
	},
	/**
	 * 添加动画到元素上
	 * @param commit
	 * @param animationName
	 */
	addElementAnimate({commit}, animationName){
		// 初始化数据
		let animateDefaultData = {
			type: animationName,
			duration: 1,
			infinite: '',
			interationCount: 1,
			delay: 0
		}
		commit('addElementAnimate', animateDefaultData)
		commit('addHistoryCache')
	},
	/**
	 * 删除动画
	 * @param commit
	 * @param index
	 */
	deleteElementAnimate({commit}, index){
		commit('deleteElementAnimate', index)
		commit('addHistoryCache')
	},

	/**
	 * 添加事件
	 * @param commit
	 * @param type
	 */
	addElementEvent({commit}, type){
		// 初始化数据
		let eventDefaultData = {
			type: type,
			url: ''
		}
		commit('addElementEvent', eventDefaultData)
		commit('addHistoryCache')
	},
	/**
	 * 删除事件
	 * @param commit
	 * @param index
	 */
	deleteElementEvent({commit}, index){
		commit('deleteElementEvent', index)
		commit('addHistoryCache')
	},

	// =====================历史纪录=======================
	/**
	 * 记入历史纪录
	 * @param commit
	 * @param index 插入到index后
	 */
	addHistoryCache({commit}){
		commit('addHistoryCache')
	},
	editorUndo({commit, state}){
		if(!getters.canUndo(state)){
			return;
		}
		const prevState = state.historyCache[state.currentHistoryIndex - 1]
		commit('relapceEditorState', cloneDeep(prevState))
		commit('editorUndo')
	},
	editorRedo({commit}){
		if(!getters.canRedo(state)){
			return;
		}
		const prevState = state.historyCache[state.currentHistoryIndex + 1]
		commit('relapceEditorState', cloneDeep(prevState))
		commit('editorRedo')
	}
};
const mutations = {
	setPrjectData(state, data){
		state.projectData = data;
	},
	setActivePageUUID(state, data){
		state.activePageUUID = data;
	},
	setActiveElementUUID(state, data){
		state.activeElementUUID = data;
	},
	/**
	 * 更新项目主图
	 * @param commit
	 * @param url
	 */
	updateCoverImage(state, url){
		state.projectData.coverImage = url
	},
	/**
	 * 新增页面
	 */
	insertPage(state, data, index){
		if(index){
			state.projectData.pages.splice(index, 0, data)
		}else{
			state.projectData.pages.push(data)
		}
	},
	/**
	 * 删除页面
	 */
	deletePage(state, index){
		state.projectData.pages.splice(index, 1);
	},

	// =============================元素相关========================================

	/**
	 * 往画板添加元素
	 * @param state
	 * @param elData
	 */
	addElement(state, elData){
		let index = state.projectData.pages.findIndex(v => {return v.uuid === state.activePageUUID})
		state.projectData.pages[index].elements.push(elData);
	},
	/**
	 * 往画板添加元素
	 * @param state
	 * @param elData  activeElementIndex
	 */
	deleteElement(state, uuid){
		let activePage = getters.activePage(state)
		let elementIndex = activePage.elements.findIndex(v => {return v.uuid === uuid})
		activePage.elements.splice(elementIndex, 1)
	},
	/**
	 * 重置元素样式，
	 * @param commit
	 * @param uuid
	 * @param styleObject
	 */
	resetElementCommonStyle(state, style){
		let activeElement = getters.activeElement(state)
		activeElement.commonStyle = merge(activeElement.commonStyle, style)
	},

	/**
	 * 添加动画到元素上
	 * @param state
	 * @param data
	 */
	addElementAnimate(state, data){
		let activeElement = getters.activeElement(state)
		activeElement.animations.push(data)
	},
	/**
	 * 删除动画到元素上
	 * @param state
	 * @param index
	 */
	deleteElementAnimate(state, index){
		let activeElement = getters.activeElement(state)
		activeElement.animations.splice(index, 1)
	},
	/**
	 * 添加事件
	 * @param state
	 * @param data
	 */
	addElementEvent(state, data){
		let activeElement = getters.activeElement(state)
		activeElement.events.push(data)
	},
	/**
	 * 删除事件
	 * @param state
	 * @param index
	 */
	deleteElementEvent(state, index){
		let activeElement = getters.activeElement(state)
		activeElement.events.splice(index, 1)
	},
	/**
	 * 改变元素zIndex
	 * @param state
	 * @param uuid
	 * @param type layerUp上一层，layerDown下一层，layerTop置顶， layerBottom置底
	 */
	resetElementZIndex(state, {uuid, type}){
		uuid = uuid || state.activeElementUUID;
		let activePage = getters.activePage(state)
		let currentElement = activePage.elements.find(v => {return v.uuid === uuid});
		let itemZIndex = currentElement.commonStyle.zIndex;
		let maxIndex = activePage.elements.length;
		let mminIndex = 1;
		let zIndexDirc = {
			layerUp: Math.min(itemZIndex + 1, maxIndex),
			layerDown: Math.max(itemZIndex - 1, mminIndex),
			layerTop: maxIndex,
			layerBottom: mminIndex,
			set0: 0
		}
		if(zIndexDirc[type] === undefined) return;
		let currentZIndex = zIndexDirc[type]
		currentElement.commonStyle.zIndex = currentZIndex;
		activePage.elements.forEach(item => {
			if(uuid === item.uuid) return;
			// 上面一位zIndex减一
			if(type === 'layerUp' && item.commonStyle.zIndex === currentZIndex){
				item.commonStyle.zIndex--
			}
			// 下面元素zIdex加一
			if(type === 'layerDown' && item.commonStyle.zIndex === currentZIndex){
				item.commonStyle.zIndex++
			}
			// 目标元素zIndex 以上的都减一
			if(type === 'layerTop' && item.commonStyle.zIndex > itemZIndex){
				item.commonStyle.zIndex--
			}
			// 目标元素zIndex以下的都加一
			if((type === 'layerBottom' || type === 'set0') && item.commonStyle.zIndex < itemZIndex){
				item.commonStyle.zIndex++
			}
		})
	},

	// ================================历史纪录========================================
	/**
	 * 新增一条历史纪录
	 * @param state
	 */
	addHistoryCache(state){
		if (state.currentHistoryIndex + 1 < state.historyCache.length) {
			state.historyCache.splice(state.currentHistoryIndex + 1)
		}
		state.historyCache.push({
			projectData: cloneDeep(state.projectData),
			activePageUUID: state.activePageUUID,
			activeElementUUID: state.activeElementUUID
		})
		// 限制undo 纪录步数，最多支持100步操作undo
		state.historyCache.splice(100)
		state.currentHistoryIndex++
	},
	/**
	 *
	 * @param state
	 */
	editorUndo(state){
		state.currentHistoryIndex--
	},
	/**
	 *
	 * @param state
	 */
	editorRedo(state){
		state.currentHistoryIndex++
	},
	/**
	 * 更新编辑器项目数据，从history中拿数据替换
	 * @param state
	 * @param data
	 */
	relapceEditorState(state, data){
		state.projectData = cloneDeep(data.projectData)
		state.activePageUUID = data.activePageUUID
		state.activeElementUUID = data.activeElementUUID
	},
	/**
	 * 设置编辑属性折叠面板展开收起状态
	 * @param state
	 * @param data
	 */
	updateActiveAttrEditCollapse(state, data){
		state.activeAttrEditCollapse = [...data];
	}
};
const getters = {
	/**
	 * 当前选中的页面index
	 * @param state
	 * @returns {*}
	 */
	currentPageIndex(state){
		// 如果不存在页面返回-1
		if(!state.projectData.pages){
			return -1;
		}
		return state.projectData.pages.findIndex(v => {return v.uuid === state.activePageUUID})
	},
	/**
	 * 当前选中的页面index
	 * @param state
	 * @returns {*}
	 */
	activeElementIndex(state){
		// 如果不存在页面返回-1
		if(!state.projectData.pages){
			return -1;
		}
		let currentPageIndex = state.projectData.pages.findIndex(v => {return v.uuid === state.activePageUUID})
		if(currentPageIndex === -1){
			return -1;
		}
		return state.projectData.pages[currentPageIndex].elements.findIndex(v => {return v.uuid === state.activeElementUUID})
	},
	/**
	 * 当前选中的页面
	 */
	activePage(){
		// 如果不存在页面返回-1
		if(!state.projectData.pages || !state.activePageUUID){
			return {commonStyle: {}, config: {}};
		}
		return state.projectData.pages.find(v => {return v.uuid === state.activePageUUID})
	},
	/**
	 * 当前选中元素
	 */
	activeElement(){
		// 如果不存在页面返回-1
		if(!state.projectData.pages){
			return {commonStyle: {}, propsValue: {}};
		}
		let currentPageIndex = state.projectData.pages.findIndex(v => {return v.uuid === state.activePageUUID})
		if(currentPageIndex === -1){
			return {commonStyle: {}, propsValue: {}};
		}
		return state.projectData.pages[currentPageIndex].elements.find(v => {return v.uuid === state.activeElementUUID})
	},
	canUndo(state) {
		return state.currentHistoryIndex > 0
	},
	canRedo(state) {
		return state.historyCache.length > state.currentHistoryIndex + 1
	},
	pageMode(state){
		return state.projectData.pageMode
	}
};

export default {
	state,
	getters,
	actions,
	mutations
}
