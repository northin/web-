// 1.解析模板
// 2.添加数据
// 3,添加 view =》 model
function Vue(obj){
    this.el = obj.el
    this.data = obj.data

    init(this)
    getTemplate(this.el,this)
    // watcher(this)
    // defProt(this.data,this.data)

}

function getTemplate(el,vm){
    var reg = /\{\{(.*)\}\}/;
    let myDom = document.createDocumentFragment()
    let templateDom = document.querySelector(el)
    // while()
    for (let i = 0; i < templateDom.childNodes.length; i++) {
        let currElement = templateDom.childNodes[i]
        if(currElement.nodeType == 1){
            let vModelValue = currElement.getAttribute("v-model")
            if(vModelValue){
                currElement.removeAttribute("v-model")
                // 2.添加数据
                let vModelData = vm.data[vModelValue]
                currElement.value = vModelData

                // 3,添加 view =》 model
                observer(currElement,vModelValue,vm)
            }
            myDom.appendChild(currElement)
            i = i -1
        }else if(currElement.nodeType == 3 && /^\s+/.test(currElement.nodeValue)){
            var regVlue = reg.test(currElement.nodeValue.trim())
            if(regVlue){
                // 2.添加数据
                let currText = currElement.nodeValue.trim().slice(2,-2).trim()
                // let currData = vm.data[currText]

                let textElement = document.createTextNode("")
                myDom.appendChild(textElement)
                document.querySelector(el).removeChild(currElement)
                i = i -1


                new Watcher(vm,textElement,currText)
            }
        }

    }
    document.querySelector(el).appendChild(myDom)
}

function Watcher(vm,node,name){
    Dep.target = this
    this.vm = vm;
    this.node = node
    this.name = name
    this.update()
    Dep.target = null
}
Watcher.prototype = {
    update:function(){
        this.get()
        this.node.nodeValue = this.value
    },
    get(){
       this.value = this.vm.data[this.name]
    }
}


function Dep(){
    this.subs = []
}
Dep.prototype = {
    addSubs:function(sub){
        this.subs.push(sub)
    },
    notify:function(){
        this.subs.forEach(element => {
            element.update()
        });
    }
}
function defProt(obj,attr,val){
    var dep = new Dep()
    Object.defineProperty(obj,attr,{
        set(value){
            val = value
            dep.notify()
        },get(){
            if(Dep.target) dep.addSubs(Dep.target)

            return val
        }
    })
}

function observer(node,text,vm){
    node.onkeyup = function(e){
        vm.data[text] = e.target.value
        console.log(vm.data[text])
    }
}

function init(vm){
  let keyList = Object.keys(vm.data);
  for (var i = 0; i < keyList.length; i++) {
    defProt(vm.data,keyList[i],vm.data[keyList[i]])
  }
}
