// @flow

import m from "mithril"
import {WindowFacade} from "../../misc/WindowFacade"
import {px} from "../../gui/size"
import {MINIMIZED_HEIGHT, MINIMIZED_WIDTH, MinimizedMailElement} from "./MinimizedMailElement"
import {MinimizedMailModel} from "../model/MinimizedMailModel"

export const MAXIMUM_AMOUNT_OF_MINIMIZED_ELEMENTS = 5

export type MinimizedMailBarAttrs = {
	windowFacade: WindowFacade,
	minimizedMailModel: MinimizedMailModel
}

/**
 *  Bar that gets rendered at the bottom of the screen for 5 most recent minimized mails to be displayed in
 *  Renders iff client is not mobile
 */
export class MinimizedMailBar implements MComponent<MinimizedMailBarAttrs> {
	_windowCloseUnsubscribe: () => mixed
	model: MinimizedMailModel

	constructor(vnode: Vnode<MinimizedMailBarAttrs>) {
		this._windowCloseUnsubscribe = () => false
		this.model = vnode.attrs.minimizedMailModel
	}

	view(vnode: Vnode<MinimizedMailBarAttrs>): Children {
		return m(".flex-end.abs", {
				oncreate: () => this._windowCloseUnsubscribe = vnode.attrs.windowFacade.addWindowCloseListener(() => true),
				onremove: () => this._windowCloseUnsubscribe(),
				style: {
					bottom: 0,
					height: px(MINIMIZED_HEIGHT),
					width: px((MINIMIZED_WIDTH * MAXIMUM_AMOUNT_OF_MINIMIZED_ELEMENTS) + (8 * MAXIMUM_AMOUNT_OF_MINIMIZED_ELEMENTS)), // we currently allow 5 popups with a margin-right of 8px
					right: px(20) // 20px to make the bar position more suitable
				}
			}, this.renderMinimizedEditors()
		)
	}

	renderMinimizedEditors(): Children {
		// slice by negative number to get the last x elements of the array
		return this.model._minimizedEditors.slice(-(MAXIMUM_AMOUNT_OF_MINIMIZED_ELEMENTS)).reverse().map(editor => m(MinimizedMailElement, {
			subject: editor.sendMailModel.getSubject(),
			close: () => {
				this.model.reopenMinimizedEditor(editor)
			},
			remove: () => {
			this.model.removeMinimizedEditor(editor)
			}
		}))
	}
}