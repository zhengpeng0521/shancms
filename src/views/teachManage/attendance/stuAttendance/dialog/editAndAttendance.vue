<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="attendanceList.courseName"
      width="600px"
    >
      <div style="margin-bottom:14px">
        <el-form label-width="100px">
          <div class="teacher_area">
            <el-form-item label="主教：">
              <el-select
                v-model="mtids"
                multiple
                disabled
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="助教：">
              <el-select
                v-model="atids"
                multiple
                disabled
              >
                <el-option
                  v-for="item in teacherList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="上课时间：">
            <el-input
              v-model="studyTime"
              placeholder="请填写上课时间"
              disabled
            />
          </el-form-item>
          <el-form-item label="课堂内容：">
            <el-input
              v-model="content"
              placeholder="请填写课堂内容（限300字）"
            />
          </el-form-item>
          <el-form-item label="课后作业：">
            <el-input
              v-model="homework"
              placeholder="请填写课后作业（限300字）"
            />
          </el-form-item>
          <el-form-item label="课堂图片：">
            <el-upload
              :class="{'disabled ': classPhotoVisible}"
              :on-change="classPhotoChange"
              :on-remove="classPhotoRemove"
              :before-upload="beforeAvatarUpload"
              :limit="3"
              :file-list="classPhotoList"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              action="https://imgsrc.ishanshan.com/gimg/upload"
              list-type="picture-card"
            >
              <i class="el-icon-plus" />
              <span>上传照片</span>
            </el-upload>
            <el-dialog :visible.sync="classImgVisible">
              <img
                :src="classPhoto"
                width="90px"
                height="90px"
                alt=""
              >
            </el-dialog>
            <div style="color:rgba(0,0,0,.43);font-size:12px">最多3张，支持png、jpg、jpeg、gif格式的图片，不大于10M</div>
          </el-form-item>
          <div class="stuDataList">
            <div
              v-for="(item, index) of attendanceList.stuList"
              :key="index"
              class="stuData_item"
            >
              <div class="stuData_item_top">
                <el-form-item
                  :label="item.name+'：'"
                  style="margin-bottom:5px"
                >
                  <div
                    v-if="item.stu_type=='1'"
                    class="courseType"
                  >
                    <div class="stuClass" />
                    <div>上课</div>
                  </div>
                  <div
                    v-else
                    class="courseType"
                  >
                    <div class="missClass" />
                    <div>补课</div>
                  </div>

                  <el-radio-group
                    v-model="item.courseType"
                    :disabled="!isCurrentDay || (item.sign_type !='1'? true:false)"
                    @change="courseTypeChange"
                  >
                    <el-radio label="3">出勤</el-radio>
                    <el-radio label="4">请假</el-radio>
                    <el-radio label="5">旷课</el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class="course_spend">
                  <div>消耗课时：</div>
                  <span v-if="costConf && costConf.length>0 && costConf[0] == '1' && item.courseType=='3'">{{ attendanceList.cost }}</span>
                  <span v-else-if="costConf && costConf.length>0 && costConf[1] == '1' && item.courseType=='4'">{{ attendanceList.cost }}</span>
                  <span v-else-if="costConf && costConf.length>0 && costConf[2] == '1' && item.courseType=='5'">{{ attendanceList.cost }}</span>
                  <span v-else>0</span>
                </div>
              </div>
              <div
                v-if="item.courseType == '3' || item.courseType == '4' || item.courseType == '5'"
                class="stuData_item_bottom"
              >
                <el-form-item label="综合评分：">
                  <el-rate
                    v-model="item.scoreNum"
                    :disabled="((item.sign_type!='1') && (parseInt(item.score)>=0)) ? true: false"
                    @change="stuScoreChange"
                  />
                </el-form-item>
                <el-form-item label="老师点评：">
                  <el-input
                    v-model="item.comment"
                    placeholder="请填写老师点评（限300字）"
                  />
                </el-form-item>
                <el-form-item label="上课图片：">
                  <el-upload
                    :class="{'disabled ': item.classStuVisible}"
                    :on-change="(file, fileList) => {stuClassImgChange(file, fileList, item)}"
                    :on-remove="(file, fileList) => {stuClassImgRemove(file, fileList, item)}"
                    :before-upload="beforeAvatarUpload"
                    :limit="3"
                    :file-list="item.classStuList"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus" />
                    <span>上传照片</span>
                  </el-upload>
                  <el-dialog :visible.sync="classImgVisible">
                    <img
                      :src="item.classImg"
                      width="90px"
                      height="90px"
                      alt=""
                    >
                  </el-dialog>
                  <div style="color:rgba(0,0,0,.43);font-size:12px">最多3张，支持png、jpg、jpeg、gif格式的图片，不大于10M</div>
                </el-form-item>
              </div>
            </div>
            <div
              v-for="(item, index) of attendanceList.tryStuList"
              :key="index+'_1'"
              class="stuData_item"
            >
              <div class="stuData_item_top">
                <el-form-item
                  :label="item.name+'：'"
                  style="margin-bottom:5px"
                >
                  <div class="courseType">
                    <div class="tryClass" />
                    <div>试听</div>
                  </div>

                  <el-radio-group
                    v-model="item.tryClassType"
                    :disabled="!isCurrentDay || (item.sign_type != '1' ? true : false)"
                    @change="tryClassTypeChange"
                  >
                    <el-radio label="2">试听</el-radio>
                    <el-radio label="3">旷课</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div
                v-if="item.tryClassType"
                class="stuData_item_bottom"
              >
                <el-form-item label="综合评分：">
                  <el-rate
                    v-model="item.scoreNum"
                    :disabled="((item.sign_type!='1') && (parseInt(item.score)>=0)) ? true: false"
                    @change="tryScoreChange"
                  />
                </el-form-item>
                <el-form-item label="老师点评：">
                  <el-input
                    v-model="item.comment"
                    placeholder="请填写老师点评（限300字）"
                  />
                </el-form-item>
                <el-form-item label="上课图片：">
                  <el-upload
                    :class="{'disabled ': item.tryStuVisible}"
                    :on-change="(file, fileList) => {tryClassChange(file, fileList,item)}"
                    :on-remove="(file, fileList) =>{tryClassRemove(file, fileList,item)}"
                    :before-upload="beforeAvatarUpload"
                    :limit="3"
                    :file-list="item.tryClassList"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    action="https://imgsrc.ishanshan.com/gimg/upload"
                    list-type="picture-card"
                  >
                    <i class="el-icon-plus" />
                    <span>上传照片</span>
                  </el-upload>
                  <el-dialog :visible.sync="item.classImgVisible">
                    <img
                      :src="item.classImg"
                      width="90px"
                      height="90px"
                      alt=""
                    >
                  </el-dialog>
                  <div style="color:rgba(0,0,0,.43);font-size:12px">最多3张，支持png、jpg、jpeg、gif格式的图片，不大于10M</div>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-form>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-form
          style="display:inline-block;margin-right:20px"
          label-width="100px"
        >
          <el-form-item style="margin-bottom:0">
            <el-checkbox v-model="isPrint">打印小票</el-checkbox>
            <el-popover
              placement="right"
              width="400"
              trigger="hover"
            >
              <div>
                <div>1.如果连接了打印机设备并且勾选，则在考勤时会打印小票</div>
                <div>2.只会对出勤的学员打印小票</div>
                <div>3.已考勤过的的学员不会打印小票</div>
              </div>
              <i
                slot="reference"
                class="el-icon-question"
              />
            </el-popover>
          </el-form-item>
        </el-form>
        <el-button
          class="cancel_btn"
          @click="cancel"
        >取消</el-button>
        <el-button
          type="primary"
          @click="submit"
        >确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { signQuery,batchStuSign } from '@/api/teachManage/attendance' //eslint-disable-line
export default {
  props: {
    teacherList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      isPrint: false, // 打印小票
      mtids: [], // 主教
      atids: [], // 助教
      studyTime: '', // 上课时间
      content: '', // 课堂内容
      homework: '', // 课后作业
      classPhoto: [], // 课堂图片
      classImgVisible: false, // 课堂图片显示
      courseScore: '', // 综合评分
      teacherComment: '', // 老师点评
      classImg: [], // 上课图片
      stuList: [],
      isCurrentDay: false, // 是否是当天
      costConf: [], // 消耗课时
      attendanceList: {},
      classPhotoVisible: false, // 课堂图片
      classPhotoList: [], // 课堂图片的列表
      scoreVisible: false
    }
  },
  methods: {
    /* 上课状态改变 */
    courseTypeChange(val) {
      this.$forceUpdate()
    },
    /* 试听 */
    tryClassTypeChange(val) {
      this.$forceUpdate()
    },
    /* 上课的打分改变 */
    stuScoreChange(val) {
      this.$forceUpdate()
    },
    /* 试听打分改变 */
    tryScoreChange(val) {
      this.$forceUpdate()
    },
    show(val, type, row) {
      this.isCurrentDay = val
      const params = {
        cpmId: row.cpmId,
        cpdId: row.cpdId
      }
      signQuery(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.attendanceList = data
          this.content = data.content
          this.homework = data.homework
          if (this.attendanceList) {
            this.dialogVisible = true
            /* 主教处理 */
            this.mtids = []
            if (this.attendanceList.mtids && this.attendanceList.mtnames) {
              const mtids = this.attendanceList.mtids && this.attendanceList.mtids.split(',')
              for (var i = 0; i < mtids.length; i++) {
                mtids[i] = mtids[i]
              }
              this.mtids = mtids
            }
            /* 助教处理 */
            this.atids = []
            if (this.attendanceList.atids && this.attendanceList.atnames) {
              const atids = this.attendanceList.atids && this.attendanceList.atids.split(',')
              this.atids = atids
            }
            if (this.attendanceList.startTime && this.attendanceList.endTime) {
              this.studyTime = this.attendanceList.startTime + '~' + this.attendanceList.endTime
            }
            this.attendanceList.stuList.map((item, index) => {
              item.courseType = item.sign_type
              item.scoreNum = item.score
            })
            this.attendanceList.tryStuList.map((item, index) => {
              item.tryClassType = item.sign_type
              item.scoreNum = item.score
            })
            // 出勤，请假，旷课判断数组
            if (this.attendanceList.costConf != null) {
              this.costConf = this.attendanceList.costConf.split(',')
            }
            /* 课堂图片回显 */
            this.classPhotoList = []
            if (this.attendanceList.picList && this.attendanceList.picList.length > 0) {
              this.attendanceList.picList.map(item => {
                const obj = {
                  url: item
                }
                this.classPhotoList.push(obj)
                if (this.classPhotoList && this.classPhotoList.length === 3) {
                  this.classPhotoVisible = true
                }
              })
            }
            /* 上课的上课图片回显 */
            let stuPicList = []
            if (this.attendanceList.stuList && this.attendanceList.stuList.length > 0) {
              this.attendanceList.stuList.map(item => {
                if (item.pictures != null) { //eslint-disable-line
                  const stuArr = []
                  stuPicList = JSON.parse(item.pictures)
                  stuPicList && stuPicList.map(stuItem => {
                    const stuObj = {
                      url: stuItem
                    }
                    stuArr.push(stuObj)
                  })
                  item.classStuList = stuArr
                  if (item.classStuList.length === 3) {
                    item.classStuVisible = true
                  } else {
                    item.classStuVisible = false
                  }
                } else {
                  item.classStuList = []
                }
              })
            }
            /* 试听的上课图片的回显 */
            let tryPicList = []
            if (this.attendanceList.tryStuList && this.attendanceList.tryStuList.length > 0) {
              this.attendanceList.tryStuList.map(item => {
                if (item.pictures != null) { //eslint-disable-line
                  const tryArr = []
                  tryPicList = JSON.parse(item.pictures)
                  tryPicList && tryPicList.map(tryItem => {
                    const tryObj = {
                      url: tryItem
                    }
                    tryArr.push(tryObj)
                  })
                  item.tryClassList = tryArr
                  if (item.tryClassList.length === 3) {
                    item.tryStuVisible = true
                  } else {
                    item.tryStuVisible = false
                  }
                } else {
                  item.tryClassList = []
                }
              })
            }
          }
        } else {
          this.$message.error(data.errorMessage || '查询考勤详情失败')
        }
      })
    },
    /* 课堂图片上传 */
    classPhotoChange(file, fileList) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        this.classPhoto = fileArr
        if (fileList.length === 3) {
          this.classPhotoVisible = true
        }
      }
    },
    /* 课堂图片移除 */
    classPhotoRemove(file, fileList) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        this.classPhoto = fileArr
        if (fileList.length < 3) {
          this.classPhotoVisible = false
        } else {
          this.classPhotoVisible = true
        }
      }
    },
    beforeAvatarUpload(file) {
      const isAccept = file.type === 'image/jpeg' || 'image/jpg' || 'image/png' || 'image/gif'
      const imageSize = file.size / 1024 / 1024 < 10// 上传图片大小不超过10M
      if (!isAccept) {
        this.$message.error('上传头像图片只能是 png、jpg、jpeg、gif格式的图片!')
      }
      if (!imageSize) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return isAccept && imageSize
    },
    /* 上课的图片 */
    stuClassImgChange(file, fileList, item) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        item.classStuArr = fileArr
        if (fileList.length === 3) {
          this.$forceUpdate()
          item.classStuVisible = true
        }
      }
    },
    /* 上课的图片 */
    stuClassImgRemove(file, fileList, item) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        item.classStuArr = fileArr
        if (fileList.length < 3) {
          this.$forceUpdate()
          item.classStuVisible = false
        }
      }
    },
    /* 试听的图片 */
    tryClassChange(file, fileList, item) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        item.tryStuArr = fileArr
        if (fileList.length === 3) {
          this.$forceUpdate()
          item.tryStuVisible = true
        }
      }
    },
    /* 试听的图片 */
    stryClassRemove(file, fileList, item) {
      const newFileList = []
      const fileArr = []
      if (file.status == 'success') { //eslint-disable-line
        if (fileList && fileList.length > 0) {
          fileList.map(item => {
            if (item.response) {
              const obj = {
                url: item.response.url,
                status: 'success'
              }
              newFileList.push(obj)
            } else {
              newFileList.push(item)
            }
          })
        }
        newFileList && newFileList.map(newItem => {
          fileArr.push(newItem.url)
        })
        item.tryStuArr = fileArr
        if (fileList.length < 3) {
          this.$forceUpdate()
          item.tryStuVisible = false
        }
      }
    },
    /* 取消 */
    cancel() {
      this.dialogVisible = false
      this.classPhotoVisible = false
    },
    /* 确定 */
    submit() {
      let imgArr = []
      const signStuList = []
      const tryList = []
      let picNum = 0
      /* 课堂图片 */
      if (this.classPhoto && this.classPhoto.length > 0) {
        picNum = this.classPhoto && this.classPhoto.length
        imgArr = this.classPhoto
      } else {
        picNum = this.classPhotoList && this.classPhotoList.length
        this.classPhotoList && this.classPhotoList.map(pic => {
          imgArr.push(pic.url)
        })
      }
      /* 上课图片 */
      this.attendanceList && this.attendanceList.stuList.map(item => {
        let stuPicNum = 0
        let stuPicArr = []
        if (item.classStuArr && item.classStuArr.length > 0) {
          stuPicNum = item.classStuArr && item.classStuArr.length
          stuPicArr = item.classStuArr
        } else {
          stuPicNum = item.classStuList && item.classStuList.length
          item.classStuList && item.classStuList.map(pic => {
            stuPicArr.push(pic.url)
          })
        }
        const stuObj = {
          cpStuId: item.id,
          signType: item.courseType,
          checkStatus: item.status,
          picNum: stuPicNum,
          score: item.scoreNum || null,
          comment: item.comment,
          picture: stuPicArr
        }
        signStuList.push(stuObj)
      })
      /* 试听图片 */
      let checkStatus = ''
      this.attendanceList && this.attendanceList.tryStuList.map(item => {
        let tryPicNum = 0
        let tryPicArr = []
        if (item.tryStuArr && item.tryStuArr.length > 0) {
          tryPicNum = item.tryStuArr && item.tryStuArr.length
          tryPicArr = item.tryStuArr
        } else {
          tryPicNum = item.tryClassList && item.tryClassList.length
          item.tryClassList && item.tryClassList.map(pic => {
            tryPicArr.push(pic.url)
          })
        }
        if (item.sign_type == '1') { //eslint-disable-line
          checkStatus = '1'
        } else {
          checkStatus = '2'
        }
        const stuObj = {
          id: item.audition_id,
          status: item.tryClassType,
          checkStatus: checkStatus,
          picNum: tryPicNum,
          score: item.scoreNum || null,
          comment: item.comment,
          picture: tryPicArr
        }
        tryList.push(stuObj)
      })
      const params = {
        cpmId: this.attendanceList.cpmId,
        cpdId: this.attendanceList.cpdId,
        content: this.content,
        homework: this.homework,
        pictures: imgArr,
        picNum: picNum,
        signStuList: signStuList,
        tryList: tryList
      }
      batchStuSign(params).then(res => {
        const data = res.data
        if (data.errorCode === 0) {
          this.dialogVisible = false
          this.$emit('toUpdateTable')
          this.$message.success(data.errorMessage)
        } else {
          this.$message.error(data.errorMessage)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher_area {
  display: flex;
  flex-wrap: nowrap;
}
.disabled /deep/ .el-upload--picture-card {
  display: none;
}
.stuDataList {
  .stuData_item {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid #ddd;
    .stuData_item_top {
      display: flex;
      flex-wrap: nowrap;
      -webkit-box-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      align-items: center;
      .courseType {
        display: inline-block;
        margin-right: 10px;
        .stuClass,
        .missClass,
        .tryClass {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #46b6ee;
        }
        .missClass {
          background: #87d068;
        }
        .tryClass {
          background: #f5a623;
        }
        div {
          display: inline-block;
        }
      }
      .course_spend {
        display: flex;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
