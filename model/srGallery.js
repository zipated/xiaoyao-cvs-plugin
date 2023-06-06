import fs from "fs";
import {
    Cfg,Data
} from "../components/index.js";
import lodash from 'lodash';
import Common from "../components/Common.js";
const _path = process.cwd();
let pathPlus = `${_path}/plugins/xiaoyao-cvs-plugin/resources/sr/`

export async function AtlasAlias(e,{render}) {
    let data =await GetData(e)
    if(!data) return false
    await Common.render(`sr/weapon/index`, {
        ...data
    },{
        e,
        render,
        scale: 1.4
    })
    return true
}


export async function GetData(e) {
    let name=e.msg.replace(/\*|#|星铁|星穹铁道|图鉴|专武/g,'')
    let list = Data.readJSON(pathPlus, 'weapon/data.json')
    let items = Data.readJSON(pathPlus, 'items/data.json')
    let role=GetRole(name)
    if(role) {
        name=role.name
    }
    let roleData;
    let isUp=e.msg.includes('专武');
    lodash.forEach(list,(v,k)=>{
        if(isUp&&v.belongRole.includes(name)){
            roleData= v
            return
        }else if([v.name,...v.names,...v?.suitRole].includes(name)&&!isUp){
            roleData= v
            return
        }
    })

    if(roleData){
        let newMaterial=[]
        for (const materialElement of roleData.material) {
            for (const newMaterialElement of materialElement) {
                if(!lodash.map(newMaterial,'id').includes(newMaterialElement.id)&&![2].includes(newMaterialElement.id*1)){
                    newMaterial.push(newMaterialElement)
                }else{

                    for (let v =0;v<newMaterial.length;v++) {
                        if(newMaterial[v].id==newMaterialElement.id){
                            newMaterial[v].num+=newMaterialElement.num
                        }
                        newMaterial[v]={...items[newMaterial[v].id],...newMaterial[v]}
                    }
                }
            }
        }
        roleData.material=newMaterial
        for (const item of Object.keys(roleData.fullValues)) {
            let {base,stop} = roleData.fullValues[item]
            roleData.fullValues[item]={
                base: parseInt(base),stop:parseInt(stop)
            }
        }
        let suitRole=[]
        for (const item of roleData.suitRole) {
            let list=GetRole(item)
            if(roleData.belongRole.includes(item)) list.isUp=true
            suitRole.push(list)
        }
        roleData.suitRole=suitRole
    }
    return roleData

}
let GetRole=(name)=>{
    let list = Data.readJSON(pathPlus, 'character/data.json')
    let role;
    lodash.forEach(list,(v,k)=>{
        if([v.name,...v.names].includes(name)){
            role=v
        }
    })
    return role
}

