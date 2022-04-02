class Utils {
    //禁止滚动条滚动
    static unScroll() {
        var top = $(document).scrollTop();
        $(document).on('scroll.unable', function (e) {
            $(document).scrollTop(top);
        })
    }

    static system_info(proxy) {
        // // electron 版本
        // console.log('process.versions.electron', process.versions.electron)
        // // ABI版本
        // console.log('process.versions.modules', process.versions.modules)
        // // NODE版本
        // console.log('process.versions.node', process.versions.node)
        // // V8 引擎版本
        // console.log('process.versions.v8', process.versions.v8)
        // // chrome版本
        // console.log('process.versions.chrome', process.versions.chrome)
        // // 架构信息
        // console.log('process.env.PROCESSOR_ARCHITECTURE', process.env.PROCESSOR_ARCHITECTURE)

        proxy.electron_version = process.versions.electron
        proxy.abi = process.versions.modules
        proxy.node = process.versions.node
        proxy.chrome = process.versions.chrome

        setInterval(function () {
            proxy.cpu = "cpu:" + process.getCPUUsage().percentCPUUsage.toFixed(2) + "%";
        }, 1000);
    }

    static msg(text) {
        $("body").tips({
            msg: text,
            // color:'#FFF',
            // bg:'rgba(155,151,146,0.38)',
            time: 2,
            x: 90,
            y: 100
        })
    }
    static drag_move(element) {
        element = document.querySelector(element);
        let dragging = false;
        let mouseX = 0;
        let mouseY = 0;
        element.addEventListener('mousedown', (e) => {
            dragging = true;
            const { pageX, pageY } = e;
            mouseX = pageX;
            mouseY = pageY;
        });
        window.addEventListener('mouseup', () => {
            dragging = false;
        });
        const {ipcRenderer} = require('electron')

        window.addEventListener('mousemove', (e) => {
            if (dragging) {
                const { pageX, pageY } = e;
                const pos = ipcRenderer.sendSync('main_window-get_position')
                pos[0] = pos[0] + pageX - mouseX;
                pos[1] = pos[1] + pageY - mouseY;
                window.moveTo(pos[0], pos[1]);
            }
        });
    }
}
