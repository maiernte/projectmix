
App.accessRule("blob:*");
App.accessRule("*");

App.info({
    id: 'com.maiyongfenggooglemailcom.huaheweb',
    name: '华鹤易学',
    description: '华鹤易学移动平台',
    author: '鎏金天涯',
    email: 'mai.yongfeng@googlemail.com',
    website: 'http://huaheweb.eu-gb.mybluemix.net',
    version: '0.0.4'
});

// Set up resources such as icons and launch screens.
App.icons({
    'iphone':    'resources/ios/icon/Icon-40.png',
    'iphone_2x': 'resources/ios/icon/Icon-60@2x.png',
    'iphone_3x': 'resources/ios/icon/Icon-60@3x.png',
    'ipad':      'resources/ios/icon/Icon-76.png',
    'ipad_2x':   'resources/ios/icon/Icon-76@2x.png',

    'android_ldpi':  'resources/android/icon/icon-ldpi.png',
    'android_mdpi':  'resources/android/icon/icon-mdpi.png',
    'android_hdpi':  'resources/android/icon/icon-hdpi.png',
    'android_xhdpi': 'resources/android/icon/icon-xhdpi.png'
});

App.launchScreens({
    'iphone':             'resources/ios/splash/Default~iphone.png',
    'iphone_2x':          'resources/ios/splash/Default@2x~iphone_640x960.png',
    'iphone5':            'resources/ios/splash/Default-568h@2x~iphone_640x1136.png',
    'iphone6':            'resources/ios/splash/Default-750@2x~iphone6-portrait_750x1334.png',
    'iphone6p_portrait':  'resources/ios/splash/Default-750@2x~iphone6-portrait_750x1334.png',
    'iphone6p_landscape': 'resources/ios/splash/Default-750@2x~iphone6-landscape_1334x750.png',
    'ipad_portrait':      'resources/ios/splash/Default-Portrait~ipad_768x1024.png',
    'ipad_portrait_2x':   'resources/ios/splash/Default-Portrait@2x~ipad_1536x2048.png',
    'ipad_landscape':     'resources/ios/splash/Default-Landscape~ipad_1024x768.png',
    'ipad_landscape_2x':  'resources/ios/splash/Default-Landscape@2x~ipad_2048x1536.png',

    'android_ldpi_portrait':  'resources/android/res/drawable-ldpi/screen.png',
    'android_ldpi_landscape': 'resources/android/res/drawable-land-ldpi/screen.png',
    'android_mdpi_portrait':  'resources/android/res/drawable-mdpi/screen.png',
    'android_mdpi_landscape': 'resources/android/res/drawable-land-mdpi/screen.png',
    'android_hdpi_portrait':  'resources/android/res/drawable-hdpi/screen.png',
    'android_hdpi_landscape': 'resources/android/res/drawable-land-hdpi/screen.png',
    'android_xhdpi_portrait': 'resources/android/res/drawable-xhdpi/screen.png',
    'android_xhdpi_landscape':'resources/android/res/drawable-land-xhdpi/screen.png'
});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
//App.setPreference('AllowInlineMediaPlayback', true);

// 17 = Version 4.2 19 = 4.4 15 = 4.0 21 = 5.0
App.setPreference('android-targetSdkVersion', '21');
App.setPreference('android-minSdkVersion', '19');