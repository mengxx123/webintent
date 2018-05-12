let ACTIONS = [
    {
        _type: 'edit',
        title: '使用【文本编辑器】编辑',
        description: '',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://text.yunser.com/editor',
        domain: 'https://text.yunser.com'
    },
    {
        _type: 'edit',
        title: '使用【文本处理】编辑',
        description: '',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://text.yunser.com/tool',
        domain: 'https://text.yunser.com'
    },
    {
        _type: 'edit',
        title: '使用【繁体字】编辑',
        description: '',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://text.yunser.com/chinese',
        domain: 'https://text.yunser.com'
    },
    {
        _type: 'save',
        title: '保存到我的云盘',
        description: '',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://file.yunser.com/',
        domain: 'https://file.yunser.com'
    },
    {
        _type: 'save',
        title: '保存到【剪切板】',
        description: '',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://clipboard.yunser.com/',
        domain: 'https://clipboard.yunser.com'
    },
    {
        _type: 'save',
        title: '保存到【我的云盘】',
        description: '',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://file.yunser.com/',
        domain: 'https://file.yunser.com'
    },
    {
        _type: 'edit',
        title: '添加到【剪切板】',
        description: '',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://clipboard.yunser.com/',
        domain: 'https://clipboard.yunser.com'
    },
    {
        _type: 'pick',
        title: '从【云盘】选择文本文件',
        description: '',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://file.yunser.com/',
        domain: 'https://file.yunser.com'
    },
    {
        _type: 'pick',
        title: '从【云盘】选择图片',
        description: '',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://image.yunser.com/',
        domain: 'https://file.yunser.com'
    },
    {
        _type: 'pick',
        title: '获取二维码图片',
        description: '',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://qrcode.yunser.com/',
        domain: 'https://qrcode.yunser.com'
    },
    {
        _type: 'pick',
        title: '本地上传文件',
        description: '',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://upload.yunser.com/',
        domain: 'https://upload.yunser.com'
    },
    {
        _type: 'pick',
        title: '本地上传文件',
        description: '',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        url: 'https://upload.yunser.com/',
        domain: 'https://upload.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '最简单的文本编辑器',
        url: 'https://b.yunser.com/',
        disposition: 'inline',
        domain: 'https://b.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        title: 'Markdown 转 HTML',
        url: 'https://markdown.yunser.com/markdown2html',
        domain: 'https://markdown.yunser.com'
    },
    {
        _type: 'download',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '文件下载',
        url: 'https://download.yunser.com/download',
        domain: 'https://download.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        title: 'HTML 转 Markdown',
        url: 'https://markdown.yunser.com/html2markdown',
        domain: 'https://markdown.yunser.com'
    },
    {
        _type: 'view',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '图片浏览器',
        url: 'https://imageviewer.yunser.com/',
        domain: 'https://imageviewer.yunser.com'
    },
    {
        _type: 'edit',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '【图片编辑器】',
        url: 'https://draw.yunser.com/',
        domain: 'https://draw.yunser.com'
    },
    {
        _type: 'edit',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '修改图片大小',
        url: 'https://imagetool.yunser.com/size',
        domain: 'https://imagetool.yunser.com'
    },
    {
        _type: 'edit',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '马赛克工具',
        url: 'https://imagetool.yunser.com/mosaic',
        domain: 'https://imagetool.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '高级文本编辑器',
        url: 'https://b.yunser.com/v2.html',
        disposition: 'inline',
        domain: 'https://b.yunser.com'
    },
    {
        _type: 'view',
        type: 'application/json',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '图形浏览器',
        url: 'https://d3.yunser.com/view',
        domain: 'https://d3.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/plain',
        icon: 'https://www.baidu.com/favicon.ico',
        title: 'HTML 编辑器',
        url: 'https://code.yunser.com',
        domain: 'https://code.yunser.com'
    },
    {
        _type: 'view',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '文本阅读器',
        url: 'https://reader.yunser.com',
        domain: 'https://reader.yunser.com'
    },
    {
        _type: 'view',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '文本阅读器',
        url: 'https://reader.yunser.com',
        domain: 'https://reader.yunser.com'
    },
    {
        _type: 'view',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '字数统计',
        url: 'https://text.yunser.com/tool',
        domain: 'https://text.yunser.com'
    },
    {
        _type: 'edit',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: 'Markdown 编辑器',
        url: 'https://mdeditor.yunser.com',
        domain: 'https://mdeditor.yunser.com'
    },
    {
        _type: 'pick',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '图片选择器',
        url: 'https://image.yunser.com/picker',
        domain: 'https://image.yunser.com'
    },
    {
        _type: 'pick',
        type: 'image/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '从【图标库】选择图片',
        description: '矢量图标素材',
        url: 'https://icon.yunser.com/pick',
        domain: 'https://icon.yunser.com'
    },
    // {
    //     type: 'image/*',
    //     icon: 'https://www.baidu.com/favicon.ico',
    //     title: '图片选择器',
    //     url: 'https://d.yunser.com',
    //     disposition: 'inline',
    //     domain: 'https://reader.yunser.com'
    // },
    {
        _type: 'share',
        type: 'text/*',
        icon: 'https://www.baidu.com/favicon.ico',
        title: '分享',
        url: 'https://share.yunser.com',
        disposition: 'inline',
        domain: 'https://share.yunser.com'
    }
]