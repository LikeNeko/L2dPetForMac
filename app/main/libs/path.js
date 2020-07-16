path.app = app.getAppPath()
path.main = path.join(path.app,'app/main/')
path.renderer = path.join(path.app,'app/renderer/')
path.res = path.join(path.app,'app/res/')

path.main_libs = path.join(path.main,'libs/')
path.main_loads = path.join(path.main,'loads/')
path.renderer_js = path.join(path.renderer,'js/')
path.renderer_views = path.join(path.renderer,'views/')
path.toDict = ()=>{
    let tmp= {};
    for (let a in path){
        if (typeof path[a] == "string"){
            tmp[a] = path[a]
        }
    }
    return tmp
}