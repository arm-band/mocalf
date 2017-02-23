/**
 * mocalf.js
 *
 * @version: 1.0.0
 * url: 
 *
 * Copyright (c) 2016 Arm=band
 *
 * Licenced under the MIT License:
 * http://opensource.org/licenses/mit-license.php
*/
(function ($) {
    $.fn.mocalf = function (options) {
        var defaults = {
            open: "#modal_open", //クリックしたらモーダルウインドウを開くトリガーとなる要素
            title: "混雑予想カレンダー", //カレンダーのタイトル
            month: 1, //表示する月
            status: ["休", "大", "混", "空", "混", "混", "大"], //デフォルトの混雑状況[日：休、月：大変混雑、火：混雑、水：空いてる、…]
            flag: ["休", "空", "混", "大"], //休みと状態1,2,3の全4つを判定させるフラグ。例：flag「休」ならicon「休み」を出力
            icon: ["休み", "空", "混", "大"], //状態として表示させる文字・アイコンの指定。休みと状態1,2,3の全4つ
            data: "./data/data.json", //オプションデータのjsonを指定するURL
            footer: "", //フッタエリアに出力する文字列(HTML可)
            close: "閉じる" //閉じるボタンの文字
        };

        var params = $.extend(defaults, options);

        return this.each(function () {
            var obj = $(this);

            main();

            //メイン処理
            function main() {
                var overlay = genOverlay();
                obj.append(overlay);
                var calendar = genCal();

                var header = genHeader(params.title);
                calendar.append(header);

                var content = genContent();
                calendar.append(content);

                var footer = genFooter(params.footer, params.close);
                calendar.append(footer);

                obj.append(calendar);
            }

            //オーバーレイ作成
            function genOverlay() {
                var overlay = $("<div/>");
                overlay.addClass("modalcal_overlay").attr("id", "overlay");

                return overlay;
            }

            //カレンダー本体作成
            function genCal() {
                var calendar = $("<div/>");
                calendar.addClass("modalcal_inner calendar").attr("id", "calendar");

                return calendar;
            }

            //カレンダーヘッダ作成
            function genHeader(str) {
                var header = $("<div/>");
                header.addClass("calendar_header");

                var title = $("<h2/>");
                title.addClass("calendar_title").text(str);
                header.append(title);

                return header;
            }

            //カレンダーコンテンツ作成
            function genContent() {
                //エラーメッセージ
                var errMsg01 = "データの形式が正しくありません。";
                var errMsg02 = "データが空です。";
                var errMsg03 = "データとパラメータの月の数が一致しません。";
                var errMsg99 = "データが読み込めませんでした。";
                
                var content = $("<div/>");
                content.addClass("calendar_content");

                //エラー用
                var errText = "";
                //データ読み込んで処理。メイン部分
                $.getJSON(params.data, {ts: new Date().getTime()}, function (data) { //$.postだと古い環境ではjsonと認識されず、文字列として判定するっぽい。hashLengthも効かず、その後の処理も不可能になるのでgetJSONでタイムスタンプ付与してキャッシュさせないようにする
                    
                    var parseFlg = $.isPlainObject(data);　//オブジェクト型かどうかチェック

                    if(parseFlg === true) { //型チェック成功ならば処理続行
                        var dataLen = hashLength(data);
                        if (dataLen > 0) {
                            if (dataLen === params.month) { //パラメータで指定された月の数とデータの月の長さが等しいなら、処理続行
                                $(data).each(function (key, val) {
                                    for (var i in val) {
                                        var body = genBody(i, val);
                                        var ul = genCalendar(i, val[i]);
                                        body.append(ul);
                                        content.append(body);
                                    }
                                });
                            } else {
                                errText = errMsg03;
                                var p = errPrc(errText);
                                content.append(p);
                            }
                        } else {
                            errText = errMsg02;
                            var p = errPrc(errText);
                            content.append(p);
                        }
                    } else {
                        errText = errMsg01;
                        var p = errPrc(errText);
                        content.append(p);
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) { //json読み込み失敗時→年月・状況指定ができないのでエラー処理
                    var errText = errMsg99;
                    var p = errPrc(errText);
                    content.append(p);
                });

                if(errText.length = 0) {
                    var body = $("<h2/>");
                    body.addClass("calendar_body");
                    content.append(body);
                }

                return content;
            }

            //カレンダー枠作成
            function genBody(key, val) {
                var body = $("<div/>");
                body.addClass("calendar_body");

                var ul = $("<ul/>");
                ul.addClass("month");
                var li = $("<li/>");
                var ym = key.slice(0, 4) + "年" + key.slice(4) + "月";
                li.text(ym);
                ul.append(li);
                body.append(ul);

                return body;
            }

            //カレンダー作成
            function genCalendar(key, val) {
                var countDay = new Date(key.slice(0, 4), key.slice(4), 0).getDate(); //Date(yyyy, MM, 0)で末日=日数を取得 //月は0～11、月末日は「来月の0日目」という考え方なので、月を-1せずにそのまま使用して日を0にする
                var firstWeek = new Date(key.slice(0, 4), key.slice(4) - 1, 1).getDay(); //月初の曜日取得[0:日,1:月, ... , 6:土] //当月の月初日の曜日を知りたいので、月は-1する。
                var rowAdd = 0;
                if ((countDay + firstWeek) % 7 !== 0) { //カレンダーに必要な行数(その月の日数+月初日の曜日分のズレ)が7で割りきれない場合、行を追加
                    rowAdd = 1;
                }
                var rowCount = Math.floor((countDay + firstWeek) / 7) + rowAdd; //カレンダーに必要な行数 / 7(一週間) + 追加行
                var liCount = (rowCount) * 7; //x7で必要なマスの数を算出

                //日～土のヘッダの行のため1行を生成
                var ul = $("<ul/>");
                var weekLabel = ["日", "月", "火", "水", "木", "金", "土"];
                for (var i = 1; i <= 7; i++) {
                    var li = $("<li/>");
                    //曜日のクラス付与
                    switch (i) {
                    case 1:
                        li.addClass("sun");
                        break;
                    case 2:
                        li.addClass("mon");
                        break;
                    case 3:
                        li.addClass("tue");
                        break;
                    case 4:
                        li.addClass("wed");
                        break;
                    case 5:
                        li.addClass("thu");
                        break;
                    case 6:
                        li.addClass("fri");
                        break;
                    case 7:
                        li.addClass("sat");
                        break;
                    }
                    var spanWeek = $("<span/>");
                    spanWeek.text(weekLabel[i-1]);
                    spanWeek.addClass("day");
                    li.append(spanWeek);
                    ul.append(li);
                }

                for (var i = 1; i <= liCount; i++) { //i=1スタート
                    var day = i - firstWeek; //日付
                    var li = $("<li/>");
                    var spanDay = $("<span/>");
                    var spanStatus = $("<span/>");

                    //曜日のクラス付与
                    switch (i % 7) {
                    case 1:
                        li.addClass("sun");
                        break;
                    case 2:
                        li.addClass("mon");
                        break;
                    case 3:
                        li.addClass("tue");
                        break;
                    case 4:
                        li.addClass("wed");
                        break;
                    case 5:
                        li.addClass("thu");
                        break;
                    case 6:
                        li.addClass("fri");
                        break;
                    case 0:
                        li.addClass("sat");
                        break;
                    }
                    if (day > 0 && day <= countDay) {
                        spanDay.addClass("day");
                        spanStatus.addClass("status");
                        spanDay.text(day);

                        var zeroSup = ""; //0埋めした日付
                        if (day < 10) {
                            zeroSup = "0" + day;
                        } else {
                            zeroSup = day;
                        }
                        if (day in val) { //dayがvalの中に存在する場合、それを状態として採用
                            setStatusClass(li, val[day]);
                            setStatusText(spanStatus, val[day]);
                        } else if (zeroSup in val) { //dayがvalの中に存在する場合、それを状態として採用
                            setStatusClass(li, val[zeroSup]);
                            setStatusText(spanStatus, val[zeroSup]);
                        } else { //キーiがvalの中に存在していない場合、デフォルトパラメータを採用
                            setStatusClass(li, params.status[(i - 1) % 7]);
                            setStatusText(spanStatus, params.status[(i - 1) % 7]);
                        }
                        li.append(spanDay).append(spanStatus);
                    }
                    ul.append(li);
                }

                return ul;
            }

            //状況のテキストからliにクラス付与
            function setStatusClass(li, status) {
                switch (status) {
                case params.flag[0]:
                    li.addClass("sts_holiday");
                    break;
                case params.flag[1]:
                    li.addClass("sts_empty");
                    break;
                case params.flag[2]:
                    li.addClass("sts_crowd");
                    break;
                case params.flag[3]:
                    li.addClass("sts_full");
                    break;
                default:
                    break;
                }

                return false;
            }

            //状況のテキストを作成
            function setStatusText(span, status) {
                switch (status) {
                case params.flag[0]:
                    span.html(params.icon[0]);
                    break;
                case params.flag[1]:
                    span.html(params.icon[1]);
                    break;
                case params.flag[2]:
                    span.html(params.icon[2]);
                    break;
                case params.flag[3]:
                    span.html(params.icon[3]);
                    break;
                default:
                    break;
                }
                return false;
            }

            //カレンダーフッタ作成
            function genFooter(htmlTxt, closeTxt) {
                var footer = $("<div/>");
                footer.addClass("calendar_footer");

                var description = $("<div/>");
                description.addClass("description").html(htmlTxt);

                var close = $("<span/>");
                close.addClass("calendar_close").attr("id", "modal_close").text(closeTxt);

                footer.append(description).append(close);

                return footer;
            }

            //モーダルウィンドウが開くときの処理
            $(params.open).on("click", function () {
                obj.removeClass("modalcal_hide");
                return false;
            });

            //モーダルウィンドウが閉じるときの処理
            $("#modal_close, #overlay").on("click", function () {
                obj.addClass("modalcal_hide");
                return false;
            });
            
            //エラー処理
            function errPrc(txt) {
                var errDOM = $("<p/>");
                errDOM.text(txt);
                return errDOM;
            }

            return false;
        });

        //連想配列の要素数を取得する関数
        function hashLength(array) {
            var length = 0;
            for (var key in array) {
                length++;
            }
            return length;
        }
    };
})(jQuery);