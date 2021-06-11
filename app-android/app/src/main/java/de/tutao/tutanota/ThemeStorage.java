package de.tutao.tutanota;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import static de.tutao.tutanota.Utils.jsonObjectToMap;

public class ThemeStorage {
	private static final String CURRENT_THEME_KEY = "theme";
	private static final String THEMES_KEY = "themes";
	private static final String TAG = "ThemeStorage";

	private final Context context;

	public ThemeStorage(Context context) {
		this.context = context;
	}

	@Nullable
	String getCurrentTheme() {
		return getPrefs().getString(CURRENT_THEME_KEY, null);
	}

	void setCurrentTheme(@NonNull String themeId) {
		getPrefs().edit().putString(CURRENT_THEME_KEY, themeId).apply();
	}

	List<Map<String, String>> getThemes() {
		Set<String> themesStrings = Objects.requireNonNull(getPrefs().getStringSet(THEMES_KEY, Collections.emptySet()));
		List<Map<String, String>> themes = new ArrayList<>();
		for (String string : themesStrings) {
			try {
				JSONObject jsonTheme = new JSONObject(string);
				Map<String, String> theme = jsonObjectToMap(jsonTheme);
				themes.add(theme);
			} catch (JSONException e) {
				Log.e(TAG, "Could not parse theme", e);
			}
		}
		return themes;
	}

	void setThemes(JSONArray themes) {
		Set<String> themeStrings = new HashSet<>();
		for (int i = 0; i < themes.length(); i++) {
			try {
				JSONObject jsonObject = themes.getJSONObject(i);
				themeStrings.add(jsonObject.toString());
			} catch (JSONException e) {
				Log.e(TAG, "Could not parse theme", e);
			}
		}
		getPrefs().edit().putStringSet(THEMES_KEY, themeStrings).apply();
	}

	@Nullable
	Map<String, String> getTheme(@NonNull String themeId) {
		List<Map<String, String>> themes = this.getThemes();
		for (Map<String, String> theme : themes) {
			if (Objects.equals(themeId, theme.get("themeId"))) {
				return theme;
			}
		}
		return null;
	}

	private SharedPreferences getPrefs() {
		return PreferenceManager.getDefaultSharedPreferences(context);
	}
}
