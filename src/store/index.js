import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import home from './modules/home/home'
import signBySelf from './modules/home/signBySelf'
import commonTable from './modules/common/commonTable'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import leadsSource from './modules/reportForm/leadsSource'
import saleWork from './modules/reportForm/saleWork'
import saleAchivement from './modules/reportForm/saleAchivement'
import contractIncome from './modules/reportForm/contractIncome'
import courseSale from './modules/reportForm/courseSale'
import giveRecord from './modules/reportForm/giveRecord'
import useClass from './modules/reportForm/useClass'
import slientStu from './modules/reportForm/slientStu'
import stuAttence from './modules/reportForm/stuAttence'
import teaching from './modules/reportForm/teaching'
import classMonth from './modules/reportForm/classMonth'
import changeThirdMain from './modules/changeThirdMain'
import materials from './modules/market/materials'
import stock from './modules/market/stock'
import lantentStu from './modules/crm/stuInfo/lantentStu'
import readStu from './modules/crm/stuInfo/readStu'
import integral from './modules/crm/integral/integral'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    errorLog,
    permission,
    tagsView,
    user,
    commonTable,

    home, // 首页
    signBySelf, // 签到

    /** crm */
    materials, // 物资管理
    stock, // 库存管理
    lantentStu, // 潜在学员
    readStu, // 在读学员
    integral, // 积分导入

    /** 销售报表 */
    leadsSource, // 来源报表
    saleWork, // 销售工作表
    saleAchivement, // 销售业绩表
    contractIncome, // 合同收入表
    courseSale, // 课程售卖
    giveRecord, // 赠课记录

    /** 教学报表 */
    useClass, // 学员消课表
    slientStu, // 沉默学员表
    stuAttence, // 学员考勤表
    teaching, // 老师授课表
    classMonth, // 课时月结表

    /** 三级菜单*/
    changeThirdMain
  },
  getters
})

export default store
