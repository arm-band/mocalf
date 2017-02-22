$(function() {
	$("#modal").mocalf({ //モーダルウインドウの枠を指定
        open    : "#modal_open",
        title   : "混雑カレンダー", //カレンダーのタイトル
        month   : 2, //表示する月
        status  : ["休", "大", "混", "空", "混", "混", "大"], //デフォルトの混雑状況[日：休、月：大変混雑、火：混雑、水：空いてる、…]
        flag: ["休", "空", "混", "大"], //休みと状態1,2,3の全4つを判定させるフラグ。例：flag「休」ならicon「休み」を出力
        icon: ["休み", "<i class=\"fa fa-fw fa-smile-o\" aria-hidden=\"true\"></i>", "<i class=\"fa fa-fw fa-meh-o\" aria-hidden=\"true\"></i>", "<i class=\"fa fa-fw fa-frown-o\" aria-hidden=\"true\"></i>"], //状態として表示させる文字・アイコンの指定。休みと状態1,2,3の全4つ
        data    : "./data/data.json", //オプションデータのjsonを指定するURL
        footer  : "<ul><li><i class=\"fa fa-fw fa-smile-o\" aria-hidden=\"true\"></i> → 比較的空いています</li><li><i class=\"fa fa-fw fa-meh-o\" aria-hidden=\"true\"></i> → 混雑が予想されます</li><li><i class=\"fa fa-fw fa-frown-o\" aria-hidden=\"true\"></i> → 大変な混雑が予想されます</li></ul><p>※過去の実績から予想したものですので、実際の混雑状況と異なる場合があります。</p>", //フッタエリアに出力する文字列(HTML可)
        close  : "× 閉じる" //閉じるボタンの文字
    });
});