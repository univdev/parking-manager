/**
 * upload 페이지 javascript
 * writer: 002
 */


var app = new Module();

function Module(){

	this.construct = function(){

		app.button.upload.form = $('form[name="upload_frm"]');
	}

	this.button = {

		/**
		 * [upload 업로드 데이터 파일 버튼 이벤트]
		 * @return {[type]} [description]
		 */
		upload: {
			form: null,

			failed : function(){
				this.form.removeClass('success');
				this.form.addClass('fail');
				$('table tbody').html('<tr><td colspan="5" class="no_data">데이터를 불러와 주십시요.</td></tr>');
				app.file.data = null;
			},

			success: function(){
				this.form.removeClass('fail');
				this.form.addClass('success');
			},

			default: function(){
				this.form.removeClass('fail success');
			}
		},

		/**
		 * [refresh 새로고침 버튼 이벤트]
		 * @return {[type]} [description]
		 */
		refresh: function(){
			app.file.data = null;
			$('form[name="upload_frm"]')[0].reset();
			$('table tbody').html('<tr><td colspan="5" class="no_data">데이터를 불러와 주십시요.</td></tr>');
		},

		/**
		 * [result 등록하기 버튼 이벤트]
		 * @return {[type]} [description]
		 */
		result: function(){

			if( ! app.file.data ){
				alert('데이터를 불러와 주십시요.');
				return false;
			}

			if(confirm('정말로 등록하시겠습니까?')){
				localStorage['data'] = JSON.stringify(app.file.data);
				alert('등록되었습니다');
				location.href = "list.html";
			} else {
				alert('취소되었습니다');
			}
		}
	},

	this.file = {
		data: null
	}
}

/* Library */
var common = {
	on: function(event, target, func){
		if(target == document)
			$(target).on(event, func);
		else
			$(document).on(event, target, func);
	}
}

common.on('change', 'form[name="upload_frm"] input', function(){

	var files = this.files;
	if(files.length){
		var file = files[0];
		var name = file.name;

		if(name == 'list.json'){
			var reader = new FileReader;
			reader.onload = function(){
				var text = reader.result;
				var json = JSON.parse(text).DATA;

				json = json.sort(function(a, b){
					var a = a.BASE_YM.date().getTime();
					var b = b.BASE_YM.date().getTime();

					return a > b ? 1 : a < b ? -1 : 0;
				})

				app.file.data = json;

				$('table tbody').html('');
				$.each(json, function(key, obj){
					var tr = "<tr>"
							tr += "<td>"+obj.BASE_YM+"</td>";
							tr += "<td>"+obj.CARNAME+"</td>";
							tr += "<td>"+obj.CARCNT+"</td>";
							tr += "<td>"+obj.CARNUM+"</td>";
							tr += "<td>"+obj.total+"</td>";
						tr += "</tr>"

					$('table tbody').append(tr);
				});

				app.button.upload.success();
			}
			reader.readAsText(file)
		} else {
			app.button.upload.failed();
		}
	}
});

/* 이벤트 리스트 */
common.on('click', '#reflash', function(){
	app.button.upload.default();
	app.button.refresh();
});

common.on('click', '#append_btn', function(){
	app.button.result();
});

/* 함수 */
function dd(){
	for(var i in arguments)
		console.log(arguments[i]);
}

/* 생성자 실행 */
$(function(){
	app.construct();
})

/**
 * [strpad 숫자 데이터변수 앞에 0 붙이기]
 * @return {[type]} [description]
 */
Number.prototype.strpad = function(){
	var val = this;
	if( val > 9)
		return val;
	else
		return '0'+val;
}

/**
 * [date 문자 데이터변수 날짜처럼 고치기]
 * @return {[type]} [description]
 */
String.prototype.date = function(){
	var val = this;
	var split = val.split('-');
	var year = split[0];
	var month = split[1]*1;
	var date = split[2];

	return new Date(year, month+1, date);
}