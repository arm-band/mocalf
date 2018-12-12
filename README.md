# mocalf.js

mocalf.jsは表形式のカレンダーを作成し、モーダルウインドウで表示するjQueryプラグインです。  
mocalf.js is a jQuery plugin for creating calendars in table format and showing at modal window.

## About mocalf.js

mocalf.jsは、モーダルウインドウでFlexboxによる表形式のカレンダーを表示させるjQueryプラグインです。  
名前は「もーかるえふ」あるいは「もーかるふ」とお読みください。

## Function

- モーダルウインドウ形式でカレンダーを表示。
- カレンダーはtableタグではなく、ul, liタグをFlexboxで制御しています。
- 表示する月の数を制御できます（2ヶ月分など）。
- タイトルが指定できます。例：「混雑予想カレンダー」。
- 各日付に4段階の状態を指定できます。例えば、「休み、空いている、ほどほど混雑、非常に混雑」といった感じです。
- jsonファイルを別途用意することで、各日付に状態を指定できます。例えば、「今月の10日は祝日なので休み、翌11日は休み明けなので非常に混雑する」のような臨機応変な対応が可能です。
- 上記とは別に、各曜日にデフォルトの状態を指定できます。例えば、「日曜日は必ず休み。翌月曜日は非常に混雑」といった具合です。このデフォルト設定を行えば、jsonファイルによる指定は最小限で済みます。
- 状態に表示する文字・アイコンはHTMLで指定可能です。「休み、空、混、大」といった文字や「休み、◯、△、×」といったマークのほか、別途Font Awesomeを読み込んでそのアイコンを指定することもできます。
- フッタに説明のhtmlを入れられます。上記アイコンを指定した場合、「◯：空いている、△：ほどほどに混雑」といった注釈などに活用ください。
- 閉じるボタンの文字を変更可能。フッタ部分に「閉じる」ボタンを付与しますが、そのボタンの文字は変更可能です。

## Demo

<a href="https://arm-band.github.io/mocalf/">Demo page</a>

## Usage

1. ダウンロードしたzipを解凍し、js、cssをHTMLに読み込ませてください（jQueryは必須なので、jQueryも読み込ませてください。）
2. HTMLにモーダルウインドウのベースと、モーダルウインドウを開くためのボタンを記述してください（詳細下記）
3. 表示させるカレンダーの内容となるjsonを用意してください
4. Javascriptに、mocalf.jsを動作させるためのスクリプトを記述してください（詳細下記）
5. 動作内容を確認してください

使用方法2.の通り、HTMLにモーダルウインドウのベースとなる空divタグと、モーダルウインドウを開くためのボタンを記述します。
<pre><code>
&lt;!-- カレンダーを開くためのボタン。id必須。 --&gt;
&lt;button type="button" id="modal_open"&gt;カレンダーを開く&lt;/button&gt;

&lt;!-- モーダルウインドウのベースとなる空divタグ。class、id必須。 --&gt;
&lt;div class="modalcal modalcal_hide" id="modal"&gt;&lt;/div&gt;
</code></pre>

次にJavascriptを記述します。

<pre><code>
$("#modal").mocalf(); //上記の空divタグのidをセレクタとして指定
</code></pre>

## Options

オプションとして指定できる項目は以下の通りです。

| パラメータ名 | 説明                                                                                            | 指定可能な形式      | デフォルト値                               |
|:-------------|:------------------------------------------------------------------------------------------------|:--------------------|:-------------------------------------------|
| open         | モーダルウインドウを開くボタンの指定                                                            | テキスト(セレクタ)  | `#modal_open`                                |
| title        | カレンダーのヘッダに表示されるタイトル                                                          | テキスト            | `混雑予想カレンダー`                         |
| month        | 表示する月の数(jsonのキー数と一致させてください)                                                | 数値                | `1                                          |
| status       | 曜日ごとのデフォルトの混雑状況                                                                  | 配列                | `["休", "大", "混", "空", "混", "混", "大"]` |
| flag         | 4段階ある混雑状況のフラグとして使う文字(statusの指定、jsonの各日付ごとの値と一致させてください) | 配列                | `["休", "空", "混", "大"]`                   |
| icon         | カレンダー中に表示させる文字・アイコンの指定                                                    | 配列                | `["休み", "空", "混", "大"]`                 |
| data         | 各日付で別個に混雑状況を指定するjsonファイルのパス                                              | テキスト            | `./data/data.json`                           |
| footer       | フッタの中に表示させるテキスト                                                                  | テキスト(HTML可)    | (なし)                                     |
| close        | フッタの閉じるボタンに表示するテキスト                                                          | テキスト            | `閉じる`                                     |

## Example

例えば、

- 表示する月：2ヶ月（年月はjson側で指定）
- 混雑状況として表示するアイコン：休み、○、△、×
- フッタに注釈を入れる
- 閉じるボタンには「× 閉じる」と表示

といった条件であれば、下記のような記述になります。

<pre><code>
	$("#modal").modalCal({
        open    : "#modal_open",
        month   : 2,
        icon: ["休み", "○", "△", "×"],
        footer  : "&lt;ul&gt;&lt;li&gt;○ → 比較的空いています&lt;/li&gt;&lt;li&gt;△ → 混雑が予想されます&lt;/li&gt;&lt;li&gt;× → 大変な混雑が予想されます&lt;/li&gt;&lt;/ul&gt;&lt;p&gt;※過去の実績から予想したものですので、実際の混雑状況と異なる場合があります。&lt;/p&gt;",
        close  : "× 閉じる" //閉じるボタンの文字
    });
</code></pre>

最後に、jsonファイルです。jsonの所在（パス）とファイル名は、上記スクリプトのdataパラメータで指定します。

<pre><code>
{
    "201610" : { //年月。yyyyMMの形で記述してください
        "6": "大", //日付と状況。どちらもダブルクォーテーションでくくってください。状況は上記スクリプトのflagの内容と合わせてください。
        "10": "休"
    }
}
</code></pre>

基本的な使い方は以上です。  
応用として、

- 2016年10月と2016年11月の2ヶ月間を表示
- 10/6は大変混雑、10/10は休み
- 11/3・11/23は休み、11/4・11/24は大変混雑

という条件であれば、下記のような記述になります。

<pre><code>
{
    "201610" : {
        "6": "大",
        "10": "休"
    },
    "201611" : {
        "3": "休",
        "04": "大",
        "23": "休",
        "24": "大"
    }
}
</code></pre>

なお、2ヶ月間表示の場合は上記スクリプトのmonthパラメータに2を指定してください。  
また、上例の通り、1桁の日付は"4"でも"04"でも（混在しても）大丈夫です。  
各日付ごとに状況を設定する必要がなくても、年月の指定のためにjsonは必要です。その場合は、下記のようにキー部に年月を記述したjsonを用意してください。

<pre><code>
{
    "201610" : {
    }
}
</code></pre>

## License

<a href="https://github.com/arm-band/mocalf/blob/master/LICENSE">MIT License</a>

## Author

アルム＝バンド

## Published Date

### 2018/12/12

- ver 1.2
    - ループのやり方を修正
- ver 1.1
    - 複数月を指定して月が1ケタの月と2ケタの月が混在した場合(例えば`291812`と`20191`)、表示順序が狂って1ケタの月が先に表示されてしまう(`20191`→`201812`)バグを修正。0パディングして年月合わせて6ケタになるように調整。なお、7ケタや4ケタは計算ができないので除外するものとしました
    - 計算上は0パディングしますが、実際のカレンダーの表示の際は1ケタの月に0を表示しないように0をカットする処理を追加しました

### 2016/10/06

- ver 1.0