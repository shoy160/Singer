// 安卓的jsBridge方法
function connectWebViewJavascriptBridge (callback) {
  if (window.WebViewJavascriptBridge) {
    callback(window.WebViewJavascriptBridge)
  } else {
    document.addEventListener(
      'WebViewJavascriptBridgeReady',
      function () {
        callback(window.WebViewJavascriptBridge)
      },
      false
    )
  }
}

// IOS的jsBridge 方法
function setupWKWebViewJavascriptBridge (callback) {
  if (window.WKWebViewJavascriptBridge) {
    return callback(window.WKWebViewJavascriptBridge)
  }
  if (window.WKWVJBCallbacks) {
    return window.WKWVJBCallbacks.push(callback)
  }
  window.WKWVJBCallbacks = [callback]

  window.webkit &&
    window.webkit.messageHandlers &&
    window.webkit.messageHandlers.iOS_Native_InjectJavascript && window.webkit.messageHandlers.iOS_Native_InjectJavascript.postMessage(null)
}

class JsBridge {
  constructor (props) {
    this.isIphone = window.navigator.userAgent.indexOf('iPhone') > -1
    console.log(`JsBridge init device os: ${this.isIphone ? 'IOS' : 'Andriod'}`)
    this.init()
    this.bridge = undefined // IOS的桥对象
  }

  init () {
    const $this = this
    if ($this.isIphone) {
      // IOS
      setupWKWebViewJavascriptBridge(function (bridge) {
        $this.bridge = bridge
      })
    } else {
      // Andriod
      connectWebViewJavascriptBridge(function (bridge) {
        console.info('JsBridge 挂载成功！')
        $this.bridge = bridge
        bridge.init(function (message, responseCallback) {
          console.log('2. WebViewJavascriptBridge.init 成功')
          const data = {
            'Javascript Responds': '测试中文!'
          }
          if (responseCallback) {
            console.log('JS responding with', data)
            responseCallback(data)
          }
        })
        bridge.registerHandler(
          'functionInJs',
          function (data, responseCallback) {
            console.log('3. WebViewJavascriptBridge.registerHandler 成功', data)
            if (responseCallback) {
              const responseData = 'Javascript Says Right back aka!'
              responseCallback(responseData)
            }
          }
        )
      })
    }
  }

  /**
   * 调用原生的方法
   * @param method 方法名
   * @param param 参数
   * @param timeout 过期时间 default：持续等待
   * @returns {Promise<any>}
   */
  callHandler (method, param, timeout = 0) {
    const { isIphone, bridge } = this
    console.log(
      `系统为${this.isIphone ? 'IOS' : 'Andriod'}:${method},${JSON.stringify(
        param
      )}`
    )
    return new Promise((resolve, reject) => {
      if (!bridge) {
        // 桥不存在
        reject(new Error('send msg error, get bridge fail!'))
      } else {
        let timeHandler
        if (timeout !== 0) {
          timeHandler = setTimeout(() => {
            reject(new Error('send msg timeout!'))
          }, timeout)
        }
        // 调用时如果太快就加延迟，防止原生未初始化完成
        setTimeout(
          () => {
            if (isIphone) {
              // IOS
              console.log('IOS调用接口')
              bridge.callHandler(method, param, function (res) {
                clearTimeout(timeHandler)
                resolve(res)
              })
            } else {
              // Andriod
              console.log('安卓调用接口')
              window.WebViewJavascriptBridge.callHandler(
                method,
                param,
                function (res) {
                  clearTimeout(timeHandler)
                  try {
                    resolve(JSON.parse(res))
                  } catch (e) {
                    reject(e)
                  }
                }
              )
            }
          },
          0
          // new Date().getTime() - initTimestamp > 1000 ? 0 : 1000
        )
      }
    })
  }

  /**
   * 注册方法给原生调用
   * @param method 方法名
   * @param cb 回调函数（arg1,fn1）=> {} //arg1:原生传递的data, fn1:给原生回复消息的cb
   */
  registerHandler (method, cb) {
    const { bridge } = this
    if (typeof cb === 'function') {
      bridge.registerHandler(method, cb)
    }
  }
}

const bridge = {}
let Vue
bridge.install = function (_Vue, options) {
  if (Vue !== _Vue) {
    const _JsBridge = new JsBridge()
    _Vue.config.globalProperties.$bridge = _JsBridge
    window.H5_JsBridge = _JsBridge
  }
  Vue = _Vue
}

export default bridge
