//判断是否支持localstroge
if (window.localStorage) {
    //如果不存在已经初始化过的存储用户信息的变量，则执行初始化操作
    if (!window.localStorage.getItem('userInfo')) {
        //默认用户数据
        window.localStorage.userInfo = JSON.stringify([
            {"name": "张大明", "age": "17", "sex": "男", "picture": "./img/boy.jpg"},

            {"name": "李凯", "age": "20", "sex": "男", "picture": "./img/boy2.jpg"},

            {"name": "王小源", "age": "14", "sex": "女", "picture": "./img/girl.jpg"},

            {"name": "赵小云", "age": "14", "sex": "女", "picture": "./img/girl2.jpg"}
        ]);
    }

} else {
    alert('This browser does NOT support localStorage');
}
var dateAry = localStorage.getItem("userInfo");
dateAry = JSON.parse(dateAry);
//建一个组件
var UserList = React.createClass({
        getInitialState: function () {
            return {usersInfo: JSON.parse(window.localStorage.userInfo)};
        },
        //显示详细信息
        showClick: function (event) {
            var ul = this.refs.tip;
            var target = event.target;
            var detail = null;
            if (target.tagName.toLowerCase() == 'div') {
                detail = target.parentNode.childNodes[1];
                if (detail.style.display == "block") {
                    detail.style.display = 'none';
                } else {
                    detail.style.display = 'block';
                }
            } else if (target.tagName.toLowerCase() == 'img' && target.className.toLowerCase() == 'expand_img') {
                detail = target.parentNode.parentNode.nextSibling;
                if (detail.style.display == "block") {
                    detail.style.display = 'none';
                } else {
                    detail.style.display = 'block';
                }
            }
            event.stopPropagation();
            event.preventDefault();
        },
        //增加用户信息的按钮：实现表单的显示和隐藏
        addClick: function (event) {
            var add_btn = this.refs.add;
            if (add_btn.style.display == "block") {
                add_btn.style.display = 'none';
            } else {
                add_btn.style.display = 'block';
            }
            event.stopPropagation();
            event.preventDefault();
        },
        //保存用户信息：把用户的信息收集起来进行本地存储并显示到页面上
        saveClick: function () {
            var submit = this.refs.sub;
            var user_name = this.refs.name.value;
            var user_age =this.refs.age.value;
            var user_sex = this.refs.sex.value;
            var me=this;
            if (window.FileReader) {
                var file = document.getElementById('file').files[0];
                if (user_name == "" || user_age == "" || user_sex == "") {
                    alert("输入不能为空");
                } else {
                    if (file) {
                        var reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onloadend = function (event) {
                            var user_img = event.target.result;
                            var add_info = {"name": user_name, "age": user_age, "sex": user_sex, "picture": user_img};
                            var temp = JSON.parse(window.localStorage.getItem('userInfo'));
                            temp.push(add_info);
                            me.setState({usersInfo: temp});
                            //信息存储到本地存储
                            window.localStorage.setItem('userInfo', JSON.stringify(temp));


                        };
                    }
                }


            } else {
                alert(" Not supported by your browser");
            }
        },
        //删除用户信息：通过点击删除按钮删除某个用户信息
        deleteClick: function (event) {
            var deleteInfo = event.target.parentNode.parentNode.childNodes[0].innerText;
            var items = JSON.parse(window.localStorage.getItem('userInfo'));

            var deleteIndex = this.state.usersInfo.map((index, value, usersInfo)=> {
                return usersInfo.indexOf(deleteInfo);
            });

            items.splice(deleteIndex, 1);
            this.setState({usersInfo: items});
            var newInfo = JSON.stringify(items);
            window.localStorage.setItem('userInfo', newInfo);
    },

    render:function () {

    var usersList = this.state.usersInfo.map((value)=>{
         return <li className="item">
             <div className="summary">
                 <span className="name">{value.name}</span>
                <span className="img_box"><img onClick={this.deleteClick.bind(this)} src="./img/delete.jpg"/><img
                    className="expand_img" src="./img/expand.jpg"/></span></div>
             <div className="detail">
                 <div className="picture"><span ><img className="head_img" src={value.picture}/></span></div>
                 <div className="describe"><span>性别：{value.sex}</span><span>年龄：{value.age}</span></div>
             </div>
         </li>
     });

    return (<div className="container">
        <ul className="list" ref="tip" onClick={this.showClick.bind(this)}>{usersList}</ul>
        <div className="add_container">
            <div className="add_div">
                <button id="add_btn" onClick={this.addClick.bind(this)}> 新增用户</button>
            </div>
            <form id="add" ref="add">
                <label>姓名：</label> <input type="text" name="name" ref="name" required="required"/><br/><br/>
                <label>年龄：</label> <input type="text" name="age"  ref="age"   required="required"/><br/><br/>
                <label>性别：</label> <input type="text" name="sex"  ref="sex"   required="required"/><br/><br/>
                <label>上传头像图片：</label> <input type="file" id="file" ref="picture" name="picture" required="required"
                                              accept="image/gif, image/jpeg"/><br/><br/>
                <input id="sub" ref="sub" type="button" value="确定提交" onClick={this.saveClick.bind(this)}/>
            </form>
        </div>
    </div>);
}
})
;
ReactDOM.render(
    <UserList />,
    document.getElementById('app')
);