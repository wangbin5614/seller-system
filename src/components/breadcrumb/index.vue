<template>
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path:link}">{{primaryTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
    </el-breadcrumb>   
</template>
<script>
export default {
    props:{
        primaryTitle:{
            type:String,
        },
        link:{
            type:String,
            default:''
        },
        title:{
            type:String
        }
    },
    data(){
        return{

        }
    },
    mounted(){

    },
    methods:{

    }
}
</script>
<style lang="scss">
   .el-breadcrumb{
       height:54px;
       line-height:54px;
       font-size:16px;
       padding-left:25px;
       .el-breadcrumb__item:last-child .el-breadcrumb__inner{
           color:#409eff;
       }
   } 
</style>
