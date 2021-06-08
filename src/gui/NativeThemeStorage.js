// @flow
import type {NativeWrapper} from "../common/NativeWrapper"
import {Request} from "../../api/common/WorkerProtocol"
import type {Theme, ThemeId, ThemeStorage} from "../../gui/theme"

export class NativeThemeStorage implements ThemeStorage {
	+_nativeApp: Promise<NativeWrapper>;

	constructor() {
		this._nativeApp = import("../common/NativeWrapper").then(module => module.nativeApp)
	}

	async getSelectedTheme(): Promise<?ThemeId> {
		return (await this._nativeApp).invokeNative(new Request("getSelectedTheme", []))
	}

	async setSelectedTheme(theme: ThemeId): Promise<void> {
		return (await this._nativeApp).invokeNative(new Request("setSelectedTheme", [theme]))
	}

	async getCustomThemes(): Promise<Array<Theme>> {
		return (await this._nativeApp).invokeNative(new Request("getCustomThemes", []))
	}

	async setCustomThemes(themes: $ReadOnlyArray<Theme>): Promise<void> {
		return (await this._nativeApp).invokeNative(new Request("setCustomThemes", [themes]))
	}
}


