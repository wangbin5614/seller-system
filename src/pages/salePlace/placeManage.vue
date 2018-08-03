<template>
  <div class="placeManage">
    <Breadcrumb primaryTitle='拍品列表' link='/placeList' title='新增拍场'></Breadcrumb>
    <div class="wrap">
      <div class="left">
        <!-- <div class="warning">未通过审核：首页图片不符合要求，请重新上传</div> -->
        <ul class="add-left">
          <li class="add-option">
            <el-upload class="upload-demo" drag accept="image/jpeg,image/jpg,image/png" action="https://upload.qiniup.com" :multiple="false" :file-list="imgUrl" :on-success="handleImgSuccess" :on-remove="handleRemoveImg" :data="postData">
              <div v-if="!imgUrl.length">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  <em>点击上传</em>
                </div>
              </div>
              <img v-else :src="imgUrl[0].url" alt="">
            </el-upload>
          </li>
          <li class="add-option">
            <span>类别</span>
            <el-select placeholder="请选择" size="small" v-model="manageData.category_id">
              <el-option :label="item.name" :value="item.id" v-for="(item,index) in cateList" :key="index"></el-option>
            </el-select>
          </li>
          <li class="add-option">
            <span>开始时间</span>
            <el-date-picker type="datetime" placeholder="选择日期" value-format="timestamp" v-model="manageData.start_time" size="small">
            </el-date-picker>
          </li>
          <li class="add-option">
            <span>保证金</span>
            <div class="right-box">
              <el-input placeholder="请输入保证金" type="number" size="small" v-model="manageData.earnest"></el-input>
              <p class="note">买家在竞买前支付的保证金</p>
            </div>
          </li>
          <li class="add-option">
            <span>支付期限</span>
            <div class="right-box">
              <el-select placeholder="请选择" size="small" v-model="manageData.payment_countdown_time">
                <el-option label="成交后24小时内" :value="24"></el-option>
                <el-option label="成交后48小时内" :value="48"></el-option>
                <el-option label="成交后72小时内" :value="72"></el-option>
              </el-select>
              <p class="note">买家逾期未支付，则该笔保证金会支付到您的账户余额中</p>
            </div>
          </li>
          <li class="add-option">
            <span>成交佣金</span>
            <div class="right-box">
              <el-input placeholder="请输入成交佣金" size="small" type="number" v-model="manageData.commission"></el-input>
              <p class="note">买家需要向您支付的佣金，成交佣金=订单金额*佣金百分比</p>
            </div>
            <b class="percent">%</b>
          </li>
          <li class="add-option">
            <span>主 持 人</span>
            <div class="right-box">
              <el-input placeholder="请输入主持人手机号" type="number" size="small" v-model="manageData.phone"></el-input>
              <p class="note">若不填写，则由您本人担任主持人</p>
            </div>
          </li>
        </ul>
        <ul class="add-right">
          <li class="add-option">
            <span>拍场名称</span>
            <el-input placeholder="请输入拍场名称" size="small" v-model="manageData.name"></el-input>
          </li>
          <li class="add-option" style="margin-bottom:6px;">
            <span>拍场介绍</span>
            <el-input resize="none" :autosize="{minRows: 6, maxRows: 6}" type="textarea" v-model="manageData.detail" placeholder="请输入拍品介绍" size="small"></el-input>
          </li>
          <li class="add-option">
            <span>竞价规则</span>
            <div class="right-box">
              <el-select placeholder="请选择" size="small" v-for="(item,index) in rules" :key="index" v-model="item.val">
                <el-option :label="item.code +'元： '+todo+'元'" :value="todo" v-for="(todo,k) in item.amount" :key="k"></el-option>
              </el-select>
            </div>
          </li>
          <li class="add-option coupon-option">
            <span>优 惠 券</span>
            <p class="text" v-if="!coupon">尚未选择优惠券</p>
            <p class="text" v-else>金额 {{coupon.amount}}元 ， 前置条件 满 {{coupon.requirement}}元</p>
          </li>
          <li class="add-option choose-option">
            <el-button type="primary" @click="toggleYhqDialog">重新选择</el-button>
          </li>
          <li class="add-option agreement-option">
            <el-checkbox v-model="agreement"></el-checkbox>
            <span :class="{'active':agreement}" @click="toggleAgreementDialog"> 协议</span>
          </li>
        </ul>
        <div class="btn-wrapper">
          <el-button type="primary" @click="saveCaogao">{{$route.query.id?'修改保存':'保存草稿'}}</el-button>
          <el-button type="primary" @click="publish">{{$route.query.id?'修改发布':'发布'}}</el-button>
        </div>
      </div>
      <div class="right table-wrapper">
        <p class="title">拍品列表</p>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" label="序号" align='center'>
          </el-table-column>
          <el-table-column prop="name" label="拍品名称" align='center'>
          </el-table-column>
          <el-table-column prop="starting_price" label="起拍价" align='center'>
            <template slot-scope="scope">
              <el-input placeholder="请输入起拍价" size="small" type="number" v-model="scope.row.starting_price"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作">
            <template slot-scope="scope">
              <el-button @click="deleteGood(scope.$index)" type="text" size="small" class="delete-btn">去除</el-button>
              <el-button type="text" size="small" class="up-btn" @click="goodsUp(scope.$index)">上移</el-button>
              <el-button type="text" size="small" class="down-btn" @click="goodsDown(scope.$index)">下移</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="add-btn" @click="ppDialog.show=true;">+新增拍品</div>
      </div>
    </div>
    <el-dialog class="dialog" title="优惠券选择" :visible.sync="showYhqDialog" width="37%" :before-close="toggleYhqDialog">
      <div class="yhq-cont">
        <el-table :data="couponList" stripe style="width: 100%">
          <el-table-column label="优惠券种类" align='center' width="90">
            <template slot-scope="scope">
              <el-radio v-model="manageData.coupon_info_id" @change="toggleYhqDialog" :label="scope.row.id">券{{scope.$index+1}}</el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额/元" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.amount}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="requirement" label="订单最低金额/元" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.requirement}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="截止时间" align='center' width="200">
            <template slot-scope="scope">
              <span>{{getTime(scope.row.create_time)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remain" label="剩余数量" align='center'>
            <template slot-scope="scope">
              <span>{{scope.row.limited==2?'不限量':scope.row.remain}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog class="dialog" title="添加拍品" :visible.sync="ppDialog.show" width="35%" :before-close="togglePpDialog">
      <div class="paipin-cont">
        <el-checkbox-group v-model="ppDialog.checkList">
          <el-checkbox :label="item" v-for="(item,index) in ppDialog.goodsList" :key="index">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="cancelOff">取消</el-button>
        <el-button type="primary" @click="confirmAdd">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog" title="" :visible.sync="showAgreementDialog" width="60%" :before-close="toggleAgreementDialog">
      <div class="agreenment-cont">
        <h3>《口令拍用户协议》</h3>
        <p class="title">第一部分 用户须知</p>
        <p>本《口令拍用户协议》（以下简称"协议"）是用户与口令拍之间有关口令拍APP软件、网络平台使用的法律协议。</p>
        <p>1.协议内容</p>
        <p>1.1 主要内容：第一部分用户须知；第二部分权利声明；第三部分必备条款；第四主要条款；</p>
        <p>1.2 变更和新增内容：</p>
        <p>1.2.1 上述内容之全部，口令拍保留根据运营需要进行更改的权利，所有更改更新后的内容将在口令拍指定的异议期间结束后立即生效；</p>
        <p>1.2.2 口令拍根据运营需要定期或不定期发布的其他规则，包括但不限于平台论坛的论坛守则、行为规范、活动规则、定义解释等其他官方信息。 请注意：鉴于用户使用网络平台服务之习惯，用户有义务自使用口令拍服务之日起每月自行主动对本最终用户使用许可协议之全部内容进行重新阅读，鉴于上述约定，用户因自身怠于履行该义务的，无权以未获知上述内容而对相关条款的法律效力提出异议。
        </p>
        <p>2. 口令拍的义务</p>
        <p>2.1 法定的口令拍采取合理的方式提请用户注意的义务将通过如下方式实现： 在本协议中口令拍以明确的足以引起用户注意的下划线、红色标记等合理方式提醒用户注意相关条款（需要强调的是，还包括但不限于用户应特别注意任何未明确标记的含有“不承担”、“免责”、“不得”、“拒绝”等类似形式用语的条款），这些条款应在中国法律所允许的范围内最大程度地适用于本协议。 除非用户接受本协议的全部条款，否则无权安装、复制、访问口令拍相关网站、充值、运行软件或以其它方式使用口令拍的网络产品。</p>
        <p>2.2 法定的口令拍向用户说明这些条款的义务将通过如下方式实现： 用户如有任何需要说明条款的要求，立即停止安装或使用平台、软件，并请自条款公布之日起30日内致电口令拍，否则视为口令拍已履行说明义务。</p>
        <p>3.用户的权利</p>
        <p> 对以上所述相关条款及本协议任何内容有异议时，用户有权利拒绝点击同意或在任何协议更新、变更、修改后30日内以致电或发送邮件形式向口令拍表示异议。用户的以下任一行为将视为用户对协议完全的认可，本用户协议将立即生效并全面地对口令拍及用户产生法律约束力：（1）在注册、下载、使用等任一环节点击“同意”；（2）以任何可能或已经与口令拍所开发软件、平台发生交互的方式使用口令拍提供的产品及服务的；（3）未在协议、规则等更新、变更、修改后30日内以致电或发送邮件形式向口令拍表示异议的。
        </p>
        <p>4. 用户的认可</p>
        <p>鉴于口令拍已依法履行了格式条款制订方的义务，用户以上行为将被视为且应当被视为用户已经完全注意并同 意了本协议所有条款尤其是提醒用户注意的条款的合法性及有效性，用户不应当以口令拍未对格式条款以合理方式提醒用户注意或未根据用户要求尽到说明义务为理由而声称或要求法院或其它任何第三方机构确认相关条款非法或无效。</p>
        <p>5. 未成年人注意条款</p>
        <p>因未成年人属于无民事行为能力人或限制民事行为能力人，未成年人不得以自己名义或使用他人名义注册或使用口令拍的平台服务或软件，他人也不得使用未成年人名义注册或使用口令拍的平台服务或软件，口令拍有权进行相关限制。 用户的以下任一行为将视为用户对协议完全的认可，本用户协议将立即生效并全面地对口令拍及用户产生法律约束力：（1）在注册、下载、使用等任一环节点击“同意”；（2）以任何可能或已经与口令拍所开发软件、平台发生交互的方式使用口令拍提供的产品及服务的；（3）未在协议、规则等更新、变更、修改后30日内以致电或发送邮件形式向口令拍表示异议的。
        </p>
        <p class="title">第二部分 权利声明</p>
        <p>1. 知识产权</p>
        <p>本平台及各类协议均受版权法保护，所有程序及图文内容非经授权方书面许可，不得以任何方式做全部或局部复制、转载或修改。本平台及包装、手册上的所有相关产品名称、商标、品牌、图片均归授权方或口令拍拥有，是属于其各自所有者的财产。</p>
        <p>2. 用户账号</p>
        <p>用户账号的所有权归口令拍所有，用户注册成功后获得的是软件、app、网络平台用户账号的使用权，相应地基于该账号产生并储存于口令拍数据库的任何数据信息（包括但不限于账号数据信息等）的所有权均属于口令拍。用户在完全遵守协议的前提下，在正常使用口令拍所提供网络服务的过程中对属于其用户账号的数据信息享有协议规定的使用权。</p>
        <p>3. 虚拟物品</p>
        <p>口令拍产品和服务中的虚拟物品，包括但不限于藏币、金币、虚拟道具等，由口令拍享有其所有权，相应地基于该虚拟物品产生并储存于口令拍数据库的任何数据信息（包括但不限于虚拟物品数据信息、等级物品数据信息等）的所有权均属于口令拍。 用户在完全遵守协议的前提下，在正常使用口令拍所提供网络服务的过程中对属于其用户账号的数据信息享有协议规定的使用权。</p>
        <p class="title">第三部分 必备条款</p>
        <p>1. 账号注册</p>
        <p>1.1 用户承诺以其真实身份注册成为口令拍的会员，并保证所提供的个人身份资料信息真实、完整、有效，依据法律规定和必备条款约定对所提供的信息承担相应的法律责任。</p>
        <p>1.2 用户以其真实身份注册成为口令拍会员后，需要修改所提供的个人身份资料信息的，口令拍应当及时、有效地为其提供该项服务。</p>
        <p>2. 用户账号使用与保管</p>
        <p>2.1 根据必备条款的约定，口令拍有权审查用户注册所提供的身份信息是否真实、有效，并应积极地采取技术与管理等合理措施保障用户账号的安全、有效；用户有义务妥善保管其账号及密码，并正确、安全地使用其账号及密码。任何一方未尽上述义务导致账号密码遗失、账号被盗等情形而给用户和他人的民事权利造成损害的，应当承担由此产生的法律责任。</p>
        <p>2.2 用户对登录后所持账号产生的行为依法享有权利和承担责任。</p>
        <p>2.3 用户发现其账号或密码被他人非法使用或有使用异常的情况的，应及时根据口令拍公布的处理方式通知口令拍，并有权通知口令拍采取措施暂停该账号的登录和使用。</p>
        <p> 2.4 口令拍根据用户的通知采取措施暂停用户账号的登录和使用的，口令拍应当要求用户提供并核实与其注册身份信息相一致的个人有效身份信息。</p>
        <p>2.4.1 口令拍核实用户所提供的个人有效身份信息与所注册的身份信息相一致的，应当及时采取措施暂停用户账号的登录和使用。</p>
        <p>2.4.2 口令拍违反2.4.1款项的约定，未及时采取措施暂停用户账号的登录和使用，因此而给用户造成损失的，应当承担其相应的法律责任。</p>
        <p>2.4.3 用户没有提供其个人有效身份证件或者用户提供的个人有效身份证件与所注册的身份信息不一致的，口令拍有权拒绝用户上述请求。</p>
        <p>2.5 用户为了维护其合法权益，向口令拍提供与所注册的身份信息相一致的个人有效身份信息时，口令拍应当为用户提供账号注册人证明、原始注册信息等必要的协助和支持，并根据需要向有关行政机关和司法机关提供相关证据信息资料。</p>
        <p>3. 服务的中止与终止</p>
        <p>3.1 用户有发布违法信息、严重违背社会公德、以及其他违反法律禁止性规定的行为，口令拍应当立即终止对用户提供服务。</p>
        <p>3.2 用户在接受口令拍服务时实施不正当行为的，口令拍有权终止对用户提供服务。该不正当行为的具体情形应当在本协议中有明确约定或属于口令拍事先明确告知的应被终止服务的禁止性行为，否则，口令拍不得终止对用户提供服务。</p>
        <p>3.3 用户提供虚假注册身份信息，或实施违反本协议的行为，口令拍有权中止对用户提供全部或部分服务；口令拍采取中止措施应当通知用户并告知中止期间，中止期间应该是合理的，中止期间届满口令拍应当及时恢复对用户的服务。</p>
        <p>3.4 口令拍根据本条约定中止或终止对用户提供部分或全部服务的，口令拍应负举证责任。</p>
        <p>4. 用户信息保护</p>
        <p>4.1 口令拍要求用户提供与其个人身份有关的信息资料时，应当事先以明确而易见的方式向用户公开其隐私权保护政策和个人信息利用政策，并采取必要措施保护用户的个人信息资料的安全。</p>
        <p>4.2 未经用户许可口令拍不得向任何第三方提供、公开或共享用户注册资料中的姓名、个人有效身份证件号码、联系方式、家庭住址等个人身份信息，但下列情况除外：</p>
        <p>4.2.1 用户授权口令拍披露的；</p>
        <p>4.2.2 有关法律要求口令拍披露的；</p>
        <p>4.2.3 司法机关或行政机关基于法定程序要求口令拍提供的；</p>
        <p>4.2.4 口令拍为了维护自己合法权益而向用户提起诉讼或者仲裁时；</p>
        <p class="title">第四部分 主要条款</p>
        <p>1. 权利的许可</p>
        <p>1.1 用户可在许可生效的时间内将移动互联网app软件安装在自己使用的移动设备上，并以app指定的方式运行本程序的一份副本。其他任何形式的未经许可的安装、使用、访问、显示、运行以及转让，都将被视为对协议的违反。</p>
        <p>2. 账号的维护</p>
        <p>2.1 账号责任</p>
        <p>2.1.1 若用户所提供的资料与事实不符或所提供的资料已变更而未更新或有任何误导之嫌导致口令拍无法为用户提供或进一步提供服务，口令拍不因此承担任何责任。</p>
        <p>2.1.2 鉴于网络服务的特殊性，口令拍无义务审核是否用户本人使用该组账号及密码，仅审核账号及密码是否与数据库中保存的一致，只要任何人输入的账号及密码与数据库中保存的一致，即可凭借该组账号及密码登陆平台，所以即使用户认为其所有的账号登陆平台的行为并非其本人所为，口令拍将不承担因此而产生的任何责任。</p>
        <p>2.2 禁止转让</p>
        <p>用户账号的使用权属于最先注册人，任何用户不得以任何形式转让（包括但不限于买卖、赠与、互易、租赁、继承等）用户账号或密码。如果口令拍发现使用者并非账号最先注册人，口令拍可以不经通知该账户使用人而直接回收该账号，同时不承担任何由此产生的法律责任，用户违反本条款规定而遭致的任何损失均由用户自行承担。</p>
        <p> 2.3 账号更新</p>
        <p>口令拍在为用户提供相关服务的前提是用户能表明用户是账号的使用权人，这必须用户提供经口令拍认可有效的相关信息（包括但不限于注册信息、历史密码等），如果用户没有牢记自己填写的注册资料及相关历史信息或未及时更新相关注册资料，用户的相关问题（包括但不限于密码找回等）将得不到解决，用户应当自行承担相应损失。</p>
        <p>3. 行为的禁止</p>
        <p>3.1 禁止用户进行以下侵害本网络平台合规性的行为，包括但不限于：</p>
        <p> 3.1.1 违反宪法确定的基本原则的；</p>
        <p>3.1.2 危害国家统一、主权和领土完整的；</p>
        <p>3.1.3 泄露国家秘密、危害国家安全或者损害国家荣誉和利益的；</p>
        <p>3.1.4 煽动民族仇恨、民族歧视，破坏民族团结，或者侵害民族风俗、习惯的；</p>
        <p>3.1.5 宣扬邪教、迷信的；</p>
        <p>3.1.6 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
        <p>3.1.7 宣扬淫秽、色情、赌博、非法彩票、暴力，或者教唆犯罪的；</p>
        <p>3.1.8 侮辱、诽谤他人，侵害他人合法权益的；</p>
        <p>3.1.9 违背社会公德的；</p>
        <p>3.1.10 有法律、行政法规和国家规定禁止的其他内容的。</p>
        <p>3.2 禁止用户利用网络平台进行与平台服务无关的行为，包括但不限于：</p>
        <p>3.2.1 未经口令拍授权访问或试图访问和网络平台及口令拍提供的相关网络服务相关的任何帐户、计算机或网络；</p>
        <p>3.2.2 未经口令拍授权利用口令拍提供的相关网络服务以任何方式收集任何其它用户的信息，包括但不限于用户的个人身份信息和通讯信息;</p>
        <p>3.2.3 利用口令拍提供的相关网络服务传输任何骚扰性的、中伤他人的、辱骂性的、恐吓性的、庸俗淫秽的或其他任何非法的信息资料；</p>
        <p>3.2.4 利用口令拍提供的相关网络服务进行任何不利于口令拍的行为；</p>
        <p>3.2.5 就口令拍及合作商业伙伴的服务、产品、业务咨询应采取相应机构提供的沟通渠道，在公众场合发布有关口令拍及相关服务的负面宣传。</p>
        <p>3.3 禁止用户进行以下侵害本平台知识产权权益的行为，包括但不限于：</p>
        <p>3.3.1 复制、翻拷、传播和在网络上陈列本产品的程序、使用手册和其它图文音像资料的全部或部分内容;</p>
        <p>3.3.2 对本平台的程序、图像、动画和音乐进行还原、反编译、反汇编、剪辑、翻译和改编等任何修改行为;</p>
        <p>3.3.3 修改或遮盖本产品程序、图像、动画、包装和手册等内容上的产品名称、公司标志、版权信息等内容;</p>
        <p>3.3.4 其它违反著作权法、计算机软件保护条例和相关法规的行为。</p>
        <p>4. 信息的搜集</p>
        <p>4.1 用户同意在口令拍与第三方合作向用户提供相关网络服务，且该第三方同意承担与口令拍同等的保护用户隐私的责任的情况下，允许口令拍将用户的注册资料等信息提供给该第三方。</p>
        <p>4.2 在不透露单个用户隐私资料的前提下，口令拍有权对整个用户数据库进行技术分析并对已进行分析、整理后的用户数据库进行商业上的利用。尽管口令拍对用户的隐私权保护做了极大的努力，但是仍然不能保证现有的安全技术措施使用户的技术信息等不受任何形式的损失。</p>
        <p>4.3 用户理解并同意，口令拍有权利向用户搜集必要的数据，以了解用户需求，不断提升服务质量。</p>
        <p>5. 信息的发送</p>
        <p>5.1 鉴于双方协议关系的达成，用户同意口令拍有权自主决定定期或不定期的向用户的电子邮箱、手机号码等任何已知的信息媒介发送口令拍判断为对向用户进一步提供服务有积极影响的信息。</p>
        <p>5.2 口令拍的服务或产品上可能刊登商业广告、或其它活动促销的广告。这些内容系广告商或商品服务提供者所为，口令拍仅提供刊登内容的媒介。用户通过口令拍或其所链接的网站所购买的服务或商品，其交易行为仅存于用户与该商品或服务的提供者之间，与口令拍无关，口令拍不承担用户与该商品或服务的提供者之间所产生的任何法律责任。</p>
        <p>6. 变更与终止</p>
        <p>6.1 用户在接受口令拍服务时实施不正当行为的，口令拍有权终止对用户提供服务，该不当行为包括但不限于违约、违法、违反公序良俗、侵犯口令拍或任何第三方之权益等。</p>
        <p>6.2 发生下列情形之一时，口令拍有权停止或中断网络服务，并且不向任何人承担因此产生的任何责任：</p>
        <p>6.2.1 对于口令拍的网络设备进行必要的保养及施工；</p>
        <p>6.2.2 其它合作厂商或相关电信业者网络系统软硬件设备的故障、失灵、或人为操作的疏失而全部或一部分中断、暂时无法使用、迟延或因他人侵入口令拍系统篡改或伪造变造资料等，造成网络平台的停止或中断者；</p>
        <p>6.2.3 由于口令拍所用的网络通信设备由于任何原因停止，无法提供服务时；</p>
        <p>6.2.4 由于不可抗力因素致使口令拍无法提供网络平台服务。</p>
        <p>6.3 用户了解并同意，口令拍所提供的网络平台作为商业行为，必然有全面终止运营的情况发生，口令拍在发生以下情况下会终止运营网络服务（1）应政府机关的命令终止运营；（2）平台软件本身的技术问题导致无法继续运营；（3）口令拍决定停止运营。不管由于任何原因终止运营，口令拍均会提前60日通知用户，用户应依照口令拍指示采取相应措施自行处理用户账号（包括注销或停止使用该账号）、平台内虚拟物品等相关事宜。用户不得以任何原因要求口令拍不得全面终止运营。</p>
        <p>7. 安全责任</p>
        <p>7.1 若用户发现其使用的账号或密码遭他人非法使用或有异常使用的情形，应立即通知口令拍并寻求可能的帮助，但前提条件是用户有义务提交国家有权机关出具的明确要求口令拍采取针对其它账号、角色、虚拟货币、虚拟道具、商品等进行限制、冻结、删除等任何权利限制的指示，否则鉴于是否用户本人使用其账号、用户权利要求是否正当等难于判断，口令拍在无法确认时将有权拒绝用户相关帮助请求，对此用户同意认同口令拍行为的合理性，放弃此情况下针对口令拍的任何权利诉求，口令拍亦无义务承担任何相关后续损失。</p>
        <p>7.2 若用户发现其使用的账号或密码遭他人非法使用或有异常使用的情形，有可能通知口令拍并寻求可能的帮助，要求口令拍采取针对任何用户的账号、角色、虚拟货币、虚拟道具、商品等进行限制、冻结、删除等任何权利限制，口令拍基于正常运营之需，有权利根据用户或国家有权机关指示，对特定用户的相关权利进行限制、取消，对此权利受到影响的用户应当同意认同口令拍行为的合理性，放弃此情况下针对口令拍的任何权利诉求，口令拍亦无义务承担任何相关后续损失，口令拍可根据情况为用户之间的相关争议处理作出协助。</p>
        <p>8. 违约责任</p>
        <p>8.1 用户同意保障和维护口令拍及其他用户的利益，如因用户违反有关法律、法规或本协议项下的任何条款而给口令拍造成损害，用户同意承担由此造成的损害赔偿责任，该等责任包括但不限于给口令拍造成的任何直接或间接损失。</p>
        <p>8.2 因用户违反有关法律、法规或本协议项下的任何条款导致任何第三方向口令拍提出任何索赔、要求或损失的，用户同意赔偿口令拍由此产生的任何直接或间接损失。</p>
        <p>9. 争议解决</p>
        <p>9.1 本协议的订立、履行、解释及争议的解决均应适用中国法律。</p>
        <p>9.2 本协议的订立、履行、解释及争议的解决均应以口令拍所提供之任何形式之电子数据、书面数据等相关内容为准，用户在此确认该等数据的准确性、有效性、合法性。</p>
        <p>9.3 如各方就本协议内容或其执行发生任何争议，应尽量友好协商解决；协商不成时，任何一方均应提交成都仲裁委员会，按照申请仲裁时该会现行有效的仲裁规则进行仲裁。仲裁的受理费用及处理费用将由提起仲裁一方独立全部承担。</p>
        <p>10. 通知和送达</p>
        <p>本协议项下口令拍的所有通知均可通过页面公告、电子邮件或常规的信件传送、页面弹窗等方式进行；该等通知以上述任何一种形式发送之日视为已送达用户。</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showAgreementDialog: false, // 协议弹窗
      agreement: true, //协议
      showYhqDialog: false, //优惠券弹窗
      ppDialog: {
        show: false,
        checkList: [], //新增拍品的model
        goodsList: [] //新增的拍品列表选项
      },
      showPpDialog: true, // 新增拍品弹窗
      imgUrl: [],
      postData: {
        token: ""
      },
      manageData: {
        images: "", //封面图
        name: "", //拍场名称
        detail: "", //拍场介绍
        category_id: "", //类别id
        start_time: "", //开拍时间
        earnest: 0, //保证金
        payment_countdown_time: 24, //支付期限
        commission: 0, //成交佣金
        phone: "", //主持人电话
        coupon_info_id: "", //优惠券id
        goods: [], //新增拍品
        rule: {
          bidrule: []
        } //竞价规则
      },
      cateList: [], //类别列表
      rules: [], //竞价规则列表
      couponList: [], //优惠券列表
      tableData: []
    };
  },
  mounted() {
    this.getToken();
    this.getCategory();
    this.getSelectRules();
    this.getCoupon();
    this.getGoods();
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  computed: {
    coupon() {
      let obj = null;
      if (this.manageData.coupon_info_id) {
        this.couponList.forEach(item => {
          if (item.id === this.manageData.coupon_info_id) {
            obj = item;
          }
        });
      }
      return obj;
    }
  },
  methods: {
    // 获取详情数据
    getDetail() {
      this.$get({
        api: "/seller/auction/view/" + this.$route.query.id
      })
        .then(({ data }) => {
          data.phone = data.compere ? data.compere.phone : "";
          data.coupon_info_id = data.info ? data.info.id : "";
          this.manageData = data;
          this.tableData = data.goods;
          if (data.images) {
            this.imgUrl = [
              {
                url: data.imghost + data.images,
                link: data.images,
                name: "封面图"
              }
            ];
          }
          if (data.rule.bidrule.length) {
            this.rules.forEach(item => {
              let obj = data.rule.bidrule.find(todo => todo.code == item.code);
              item.val = obj.amount;
            });
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    toggleAgreementDialog() {
      this.showAgreementDialog = !this.showAgreementDialog;
    },
    toggleYhqDialog() {
      this.showYhqDialog = !this.showYhqDialog;
    },
    togglePpDialog() {
      this.ppDialog.show = !this.ppDialog.show;
    },
    getToken() {
      this.$get({
        api: "/qiniu/token"
      })
        .then(({ data }) => {
          this.postData.token = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    //添加拍品取消事件
    cancelOff() {
      this.ppDialog.show = false;
      this.ppDialog.checkList = [];
    },
    //添加拍品确认事件
    confirmAdd() {
      this.ppDialog.checkList.forEach((item, index) => {
        if (!this.tableData.find(todo => todo.id == item.id)) {
          this.tableData.push(item);
        }
      });
      this.ppDialog.show = false;
      this.ppDialog.checkList = [];
    },
    //拍品列表去除事件
    deleteGood(index) {
      this.tableData.splice(index, 1);
    },
    // 拍品上移事件
    goodsUp(index) {
      if (this.tableData.length > 1 && index !== 0) {
        let arr = Object.assign([], this.tableData);
        arr[index] = arr.splice(index - 1, 1, arr[index])[0];
        this.tableData = arr;
      }
    },
    // 拍品下移事件
    goodsDown(index) {
      if (this.tableData.length > 1 && index !== this.tableData.length - 1) {
        let arr = Object.assign([], this.tableData);
        arr[index] = arr.splice(index + 1, 1, arr[index])[0];
        this.tableData = arr;
      }
    },
    //获取拍品列表
    getGoods() {
      let link = "";
      if (this.$route.query.id) {
        link = "/seller/auction/selectgoods?id=" + this.$route.query.id;
      } else {
        link = "/seller/auction/selectgoods";
      }
      this.$get({
        api: link
      })
        .then(({ data }) => {
          this.ppDialog.goodsList = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    //类别
    getCategory() {
      this.$get({
        api: "/category/list"
      })
        .then(({ data }) => {
          this.cateList = data;
          if (!this.$route.query.id) {
            this.manageData.category_id = data[0].id;
          }
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 竞价规则
    getSelectRules() {
      this.$get({
        api: "/seller/auction/selectrules"
      })
        .then(({ data }) => {
          data.forEach(item => {
            item.val = item.amount[0];
          });
          this.rules = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 获取优惠券
    getCoupon() {
      this.$get({
        api: "/seller/auction/selectcoupon"
      })
        .then(({ data }) => {
          this.couponList = data;
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    },
    // 封面图删除
    handleRemoveImg(file, fileList) {
      this.imgUrl = [];
    },
    // 封面图上传成功
    handleImgSuccess(res, file) {
      this.imgUrl = [{ url: file.url, link: res.key, name: file.name }];
    },
    // 保存草稿 修改保存草稿
    saveCaogao() {
      if (!this.manageData.name) {
        this.$message.error("拍品名称不能为空！");
        return;
      } else {
        if (this.$route.query.id) {
          this.submit(2);
        } else {
          this.submit(1);
        }
      }
    },
    // 发布 修改发布
    publish() {
      if (!this.agreement) {
        this.$message.error("请先勾选协议");
      } else if (!this.manageData.name) {
        this.$message.error("拍品名称不能为空！");
      } else if (!this.imgUrl.length) {
        this.$message.error("图片不能为空！");
      } else if (!this.manageData.detail) {
        this.$message.error("拍场介绍不能为空！");
      } else if (!this.manageData.start_time) {
        this.$message.error("开拍时间不能为空！");
      } else if (this.manageData.earnest < 0) {
        this.$message.error("保证金不能为空或小于0！");
      } else if (!this.manageData.payment_countdown_time) {
        this.$message.error("支付期限不能为空！");
      } else if (this.manageData.commission < 0) {
        this.$message.error("成交佣金不能为空或小于0！");
      } else if (!this.tableData.length) {
        this.$message.error("拍品不能为空！");
      } else if (!!this.rules.find(item => !item.val)) {
        this.$message.error("竞价规则不能为空！");
      } else {
        if (this.$route.query.id) {
          this.submit(4);
        } else {
          this.submit(3);
        }
      }
    },
    // 提交数据
    submit(type) {
      //  type =1 保存草稿 type=2 修改后保存  type=3 发布  type=4 修改后发布
      let link = "";
      if (type == 1) {
        link = "/seller/auction/save";
      } else if (type == 2) {
        link = "/seller/auction/update/save";
      } else if (type == 3) {
        link = "/seller/auction/publish";
      } else if (type == 4) {
        link = "/seller/auction/update/publish";
      }
      if (this.imgUrl.length) {
        this.manageData.images = this.imgUrl[0].link;
      }
      this.manageData.rule.bidrule = [];
      this.rules.map((item, index) => {
        this.manageData.rule.bidrule.push({
          amount: item.val,
          code: item.code
        });
      });
      this.manageData.goods = [];
      this.tableData.forEach(item => {
        this.manageData.goods.push({
          id: item.id,
          starting_price: item.starting_price
        });
      });
      this.$post({
        api: link,
        data: this.manageData
      })
        .then(({ data }) => {
          this.$router.go(-1);
        })
        .catch(err => {
          this.$message.error(err.response.data.msg);
        });
    }
  }
};
</script> 

<style lang="scss" scoped>
.placeManage {
  padding: 0 15px 15px;
}
.upload-demo {
  text-align: right;
  width: 100%;
  height: 210px;
}
.paipin-cont {
  .el-checkbox {
    display: block;
    margin: 0 0 10px 32px;
  }
}
.dialog-footer {
  .el-button {
    width: 108px;
    padding: 8px 20px;
  }
  .el-button--primary {
    background: #67c239;
    border: 1px solid #67c239;
  }
}
.wrap {
  background: #fff;
  overflow: hidden;
  padding: 30px 24px;
  .left {
    position: relative;
    width: 824px;
    float: left;
    font-size: 14px;
    padding: 35px 30px 0 0;
    box-sizing: border-box;
    overflow: hidden;
    .warning {
      color: red;
      text-align: center;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
    }
    .add-left {
      float: left;
      width: 52.5%;
      img {
        width: 100%;
        height: 100%;
        margin-bottom: 38px;
      }
    }
    .add-right {
      float: right;
      width: 47.5%;
      padding-left: 20px;
      box-sizing: border-box;
    }
    .add-option {
      position: relative;
      display: flex;
      margin-bottom: 10px;
      .el-input,
      .right-box,
      .el-select {
        flex: 1;
        width: 100%;
      }
      .percent {
        position: absolute;
        right: 3px;
        top: 8px;
      }
      .right-box .el-select:nth-child(2) {
        margin: 10px 0;
      }
      .note {
        margin-top: 12px;
        color: red;
        font-size: 12px;
      }
      .el-textarea {
        margin-bottom: 44px;
      }
      span {
        flex: 0 0 66px;
        width: 66px;
        line-height: 32px;
        font-weight: bold;
      }
    }
    .coupon-option {
      margin-top: 34px;
      .text {
        flex: 1;
        line-height: 32px;
      }
    }
    .choose-option {
      margin: 36px 0 42px;
      padding-left: 66px;
      .el-button--primary {
        background: #fff;
        color: #409eff;
      }
    }
    .agreement-option {
      span {
        line-height: 1;
        margin-left: 5px;
        text-decoration: underline;
        font-weight: normal;
        color: #666;
        cursor: pointer;
        &.active {
          color: #409eff;
        }
      }
      padding-left: 66px;
    }
    .btn-wrapper {
      width: 100%;
      float: left;
      margin: 50px 0 20px;
    }
  }
  .right {
    float: right;
    width: 760px;
    .title {
      font-weight: bold;
    }
    .add-btn {
      margin-top: -15px;
      height: 32px;
      line-height: 32px;
      background: #ecf7ff;
      color: #409eff;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
    }
    .delete-btn {
      color: #e6a23c;
    }
    .up-btn,
    .down-btn {
      color: #585b5d;
    }
  }
}
.agreenment-cont {
  h3 {
    text-align: center;
  }
  p {
    line-height: 24px;
  }
  .title {
    font-weight: bold;
  }
}
</style>
