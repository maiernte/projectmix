
App.accessRule("*");

App.info({
    id: 'com.maiyongfenggooglemailcom.huaheweb',
    name: '华鹤易学',
    description: '华鹤易学移动平台',
    author: '鎏金天涯',
    email: 'mai.yongfeng@googlemail.com',
    website: 'http://huahe.eu-gb.mybluemix.net',
    version: '0.0.1'
});

// Set up resources such as icons and launch screens.
App.icons({
    'iphone': 'resources/android/icon-48-mdpi.png',
    'iphone_2x': 'resources/android/icon-96-xhdpi.png',

    'android_ldpi': 'resources/android/icon-36-ldpi.png',
    'android_mdpi': 'resources/android/icon-48-mdpi.png',
    'android_hdpi': 'resources/android/icon-72-hdpi.png',
    'android_xhdpi': 'resources/android/icon-96-xhdpi.png'
});

App.launchScreens({
    'iphone': 'resources/huahe_screen.png',
    'iphone_2x': 'resources/huahe_screen.png',

    'android_ldpi_portrait': 'resources/huahe_screen.png',
    'android_ldpi_landscape': 'resources/huahe_screen.png',
    'android_mdpi_portrait': 'resources/huahe_screen.png',
    'android_mdpi_landscape': 'resources/huahe_screen.png',
    'android_hdpi_portrait': 'resources/huahe_screen.png',
    'android_hdpi_landscape': 'resources/huahe_screen.png',
    'android_xhdpi_portrait': 'resources/huahe_screen.png',
    'android_xhdpi_landscape': 'resources/huahe_screen.png'
});

// Set PhoneGap/Cordova preferences
//App.setPreference('BackgroundColor', '0xff0000ff');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('AllowInlineMediaPlayback', true);
