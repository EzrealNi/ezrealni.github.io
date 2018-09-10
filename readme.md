## share.js 用法说明

1. 引入  
`import Share from '@comp/share/share';`  
2. 初始化  

```
const shareConfig = {
    // 通用
    title: '我是分享标题', // 分享标题
    desc: '我是分享描述', // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    img_url: 'https://haitao.nos.netease.com/9b1e97e2-fed9-4d47-a992-54a31e8dfc72_987_987.jpg', // 分享图标
    timeLineTitle: '我是分享到朋友圈标题', // 分享到朋友圈标题，默认取 title
    shareSuccess: () => {
        // 分享成功回调
        alert('shareSuccess');
    },
    // 以下参数仅对微信环境生效
    // wxConfig: '', // 获取wxConfig接口地址，默认 http://dist.yiupin.com/wxConfig.html
    isDebug: false, // debug模式
    afterApiReady: wx => {
        // wx sdk加载完回调 可以定制特殊需求的业务
        console.log('afterApiReady', wx);
    },
    hideMenuItems: ['share:facebook', 'share:timeline'], // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3 不需传'menuItem:'
    showMenuItems: [], // 要显示的菜单项（不传显示所有菜单），所有menu项见附录3 不需传'menuItem:'

    // 以下参数仅对app环境生效
    sheet_title: '我是浮层标题', // 浮层标题
    sheet_content: '我是浮层文案内容', // 浮层文案内容  sheet的内容<bold>表示强调</bold>
    sheet_style: 0, // 可选默认为0，sheet的风格 无需传入
    uncompressedImgUrl: 'https://haitao.nos.netease.com/9b1e97e2-fed9-4d47-a992-54a31e8dfc72_987_987.jpg', // 分享出去的图片链接
    imgOnlyUrlList: ['https://haitao.nos.netease.com/a48918dd-1b65-40a0-b33b-9075107d260d.png'], // 朋友圈分享图片
};

this.share = new Share(shareConfig);
```  

3. 更新分享配置  

```
const config = {
    title: '我是分享标题2', // 分享标题
    desc: '我是分享描述2', // 分享描述
    link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
    // eslint-disable-next-line
    img_url: 'https://haitao.nos.netease.com/9b1e97e2-fed9-4d47-a992-54a31e8dfc72_987_987.jpg', // 分享图标
    timeLineTitle: '我是分享到朋友圈标题2', // 分享到朋友圈标题，默认取 title
    imgOnlyUrlList: ['https://haitao.nos.netease.com/93a3ed7e-41a4-48ff-a2c1-bcb551053c7e.png'], // 朋友圈分享图片
    // sheet_config: {
    sheet_title: '我是浮层标题2', // 浮层标题
    sheet_content: '我是浮层文案内容2', // 浮层文案内容  sheet的内容<bold>表示强调</bold>
    sheet_style: 0, // 可选默认为0，sheet的风格 无需传入
    uncompressedImgUrl: 'https://haitao.nos.netease.com/58744fe8-f238-48c3-8dd0-ca662694d35c.png' // 分享出去的图片链接
    // }
};
this.share.updateShare(config);
```  

4. app内提供隐藏右上角分享按钮方法  
`this.share.toggleAppShareBtn(false);`  
5. 触发分享浮层  
`this.share.triggerShare();`  
6. 本地调试微信分享小技巧  
本地host指向 m.yiupin.com  
获取签名指向 http://dist.yiupin.com/wxConfig.html?url=123  
手机通过代理连上电脑
