function ModuleLoader(){
    var modules = {};

    function getInstance(name){
        if(modules[name]){
            return modules[name];
        }else{
            throw new Error(`Undefined Module: ${name}`);
        }
    }

    function define(moduleName,dependencies,implementation){
        if(modules[moduleName]){
            throw new Error(`Module ${moduleName} already exists`);
        }else{
            let depsInstance = dependencies.map((dep)=>{
                return getInstance(dep); 
            });
            modules[moduleName] = implementation.apply(implementation,depsInstance);
        }
    }

    return {
        getInstance: getInstance,
        define: define
    };
};

let loader = ModuleLoader();

loader.define('HttpClient',[],function HttpClient(){
    function get(url){
        return fetch(url).then(response => response.json());
    }

    return {
        get: get
    }
});

loader.define('PostManager',['HttpClient'],function PostManager(httpClient){
    function getPosts(){
        httpClient.get('https://jsonplaceholder.typicode.com/posts').then(posts=>{
            console.log('Posts',posts);
        })
    };

    return {
        getPosts: getPosts
    }
});

let postManager = loader.getInstance('PostManager');
postManager.getPosts();