/**
 * List 페이지 javascript 코딩
 * writer: 002
 */

var app = new Module();

/* 모듈 전체 관리 Module */

function Module(){

	/* 생성자 */
	this.construct = function(){
		app.table.writeData();
		app.chart.draw();
	},

	/* 테이블 관련 함수 */
	this.table = {

		/* 초기화 */
		reset: function(){
			$('table tbody').html('<tr><td colspan="6" class="no_data">데이터를 불러와 주십시요.</td></tr>');
		},

		/* 데이터를 테이블에 작성하기 */
		writeData: function(){
			var data = app.db.load('data');
			$('table tbody').html('');

			if(data.length > 0){
				$('table tbody').css('max-height', 50*data.length);
				$.each(data, function(key, obj){
					var name = obj.CARNAME;
					var cnt = obj.CARCNT;
					var base = obj.BASE_YM;
					var num = obj.CARNUM;
					var total = obj.total;

					var tr = "<tr data-idx='"+key+"' class='loaded'>";
							tr += '<td><span><input type="checkbox" data-idx="'+key+'"></span></td>';
							tr += '<td><span>'+base+'</span></td>';
							tr += '<td><span>'+name+'</span></td>';
							tr += '<td><span>'+cnt+'</span></td>';
							tr += '<td><span>'+num+'</span></td>';
							tr += '<td><span>'+total+'</span></td>';
						tr += "</tr>";

					$('table tbody').append(tr);
				});
			} else {
				app.table.reset();
			}
		}
	}

	/* 로컬스토리지 */
	this.db = {
		load: function(table){
			return typeof localStorage[table] == 'undefined' ? new Array() : JSON.parse(localStorage[table]);
		},

		save: function(table, data){
			localStorage[table] = JSON.stringify(data);
		}
	}

	/* 차트 관련 메소드 */
	this.chart = {

		draw: function(){
			var data = app.db.load('data');
			if(data.length){

				var data = data.sort(function(a, b){
					var a = a.total;
					var b = b.total;

					return a < b ? 1 : a > b ? -1 : 0;
				});

				var cvs = document.getElementById('canvas_chart');
				var ctx = cvs.getContext('2d');

				var width = cvs.width;
				var height = cvs.height;
				var max = data[0].total;
				var lastPosition = 0;
				var red = 255;

				$.each(data, function(key, obj){

					red -= Math.floor(255 / data.length);

					var w = width / data.length;
					var h = obj.total / max * height;

					ctx.fillStyle = 'rgba('+red+', 0, 0, 1)';

					ctx.beginPath();
					ctx.fillRect(lastPosition, height-h, w, height);

					ctx.font = '13px Dotum'
					ctx.fillStyle = 'white';

					if(key <= 2){
						ctx.fillText('주차장명 : '+obj.CARNAME, lastPosition+5, height-h+20);
						ctx.fillText('전체 판매수량 : '+obj.total, lastPosition+5, height-h+40);
					} else if(max / 10 < obj.total){
						ctx.fillText('전체 판매수량 : '+obj.total, lastPosition+5, height-h+20);
					}
					ctx.closePath();

					lastPosition += w;
				})
			}
		}
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

/* 이벤트 리스트 */
common.on('click', 'table tbody tr input[type="checkbox"]', function(){

	var me = $(this);
	var parent = me.parent().parent().parent('tr');

	if(parent.hasClass('selected')){
		parent.removeClass('selected');
	} else {
		parent.addClass('selected');
	}
});

common.on('click', '#download_btn', function(){
	var target = $('table tr.selected');

	if(target.length == 0){
		alert('다운로드하실 데이터를 선택해주세요 !');
		return false;
	}

	$.each(target, function(){
		var idx = $(this).data('idx');
		var data = app.db.load('data');
		var now = data[idx];

		var name = now.CARNAME;
		var cnt = now.CARCNT;
		var base = now.BASE_YM;
		var num = now.CARNUM;
		var total = now.total;

		var msg = [];
		msg.push('기준년월 : '+base);
		msg.push('주차장명 : '+name);
		msg.push('정기권대수[소형] : '+cnt);
		msg.push('정기권대수[대형] : '+num);
		msg.push('전체 현재판매량 : '+total);

		alert(msg.join('\n'));
	});
});

/* 함수들 */
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