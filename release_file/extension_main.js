////このjsでやっていること////
/*
webページからデータ取得
取得したデータにsection(ページになる)を追加
sectionからスライドにする
*/

//グローバル変数
var fqdn_url; //ダウンロード元のurl


//開いているwebサイトからhtmlデータを受け取る
//参考url http://takuya-1st.hatenablog.jp/entry/2016/05/30/194801
//javascriptからXMLHttpRequest投げる方法とjqueryから投げる方法の２種類あったが、
//基本を覚えるためにjavascriptで今回は記述
window.get  = function ( url, load){
  xhr = new XMLHttpRequest();//オブジェクトを作成
  xhr.responseType  = "document"; //プロパティの設定:レスポンスボディの内容を Document 型で取得
  xhr.onload = function(e){ //XHR 送信が成功したときに実行されるイベント。eはevent。eでなくてもおｋ
    //送信が成功した場合、eに値が勝手に入る
    //xhr.addEventListener("load",function(ev){});という形でも書ける
    //console.log(e);
    var dom = e.target.responseXML ; //送信結果
    load.call(dom); //結果を実行
    }
  xhr.open("get", url);//リクエストを開始。準備だけで、送信はまだ。
  xhr.send();//実際に送信、本文にはリクエスト本文がかける。
}


//wikiコンテンツにsectionを追加する
function change_section(){
  //以下の関数は実行する順番が大事。順不同
  //h2タグからh1,h2までの内容をsectionで囲む。これでh2タグのsectionができる
  $(".slides h2").each(function() { //class=slides配下のh2タグを見つける eachは順次全てのタグに対して処理
    $(this).nextUntil("h1,h2,section").add(this).wrapAll("<section></section>");
  });

  //h1タグをsectionで囲む
  $(".slides h1").wrap("<section></section>");
  //以下コードでも代替可能（プレーンなテキストにできるs）
  //  $("h1").replaceWith(function() {
  //    $(this).replaceWith('<section><h1>'+ $(this).text()+'</h1></section>');
  //  });


  //sectionで囲まれていない部分をsectionで囲む
  //何かしらのタグで囲まれていないとなぜか以下関数でsectionで囲まれない
  //add(this)をつけるとsection内にsectionが出来てしまうので注意
  $(".slides section").each(function(){
    $(this).nextUntil("section").wrapAll("<section></section>");
  });

  $(".slides code").attr("class","hljs");//reveal.jsが自動で<pre>を付与するため不要?
  //$("pre").removeClass();

  $("#f_page").remove();

  //console.log("//wikiコンテンツをmarkdown記法に変換完了");

};



//wikiコンテンツをmarkdown記法に変換する
function change_mark(){

  $("a").replaceWith(function() {
    $(this).replaceWith("\n---\n# "+ $(this).text()+"\n\n---\n")
  });

  $("h1").replaceWith(function() {
    $(this).replaceWith("\n---\n# "+ $(this).text()+"\n\n---\n")
  });

  $("h2").replaceWith(function() {
    $(this).replaceWith("## "+$(this).text())
  });

  $("li").replaceWith(function() {
    $(this).replaceWith("* "+$(this).html())
  });
  //console.log("//wikiコンテンツをmarkdown記法に変換完了");

  //markdownからスライドショーにするためには、テキストテンプレートをhtml内に準備しないといけない
  //テキストテンプレート内にタグを書いても認識されないため、最後に置換（テキストテンプレート化<script type=\"text/template\">）する
  //テキストテンプレート化
  $("#markdown_template").replaceWith(function() {
    $(this).replaceWith("<script type=\"text/template\">"+$(this).text()+"</script>")
  });

};




//
//html読み込み終わり、DOMツリーの構築まで完了したら実行.全てのリソースを対象にしたい場合は$(window).on~~
$(function(){
  chrome.storage.local.get('data',function(value){  //保存されたurlを読み込む
    //alert(value.title);
    // console.log(value);
    document.title = value.data[0][1]; //ページタイトルを変更
    active_url = value.data[0][2];
    fqdn_url = active_url.substring(0,active_url.indexOf("/",9));  //FQDNを取り出す
    //console.log(fqdn_url);
    window.get(active_url, function(){
      //console.log(this.querySelector("#wikicard"));
      //var wiki_content = document.getElementById("markdown_text"); //slide_page.htmlの
      //wiki_content.innerHTML = this.querySelector("#wikicard").innerHTML;
      var wiki =  this.querySelector(".markdown-body").innerHTML;  //backlog内のソースから.markdown-bodyを抜き取る
      //console.log(wiki);

      $('#markdown_text').replaceWith(function() {
        $(this).replaceWith(wiki); //置換する
      });
      // $("#markdown_text").html(wiki);

      //sectionを追加する
      change_section();

      //wikiコンテンツをmarkdown記法に変換する
      //    change_mark();

      //urlを正しく整形する
      change_url();

      //スライドショーを生成する
      change_html();
    });
  });
});



function change_url(){
  $(".slides a").each(function(){
    var link = $(this).attr("href");//スライド内のhrefを取得する

    if (link.match(/^\#/)) {　// #からリンクが始まっている場合、ページ内リンク
      //#で始まるurlは何もしない。
    } else if (link.indexOf('http') == -1) { //httpで始まらないリンクは正しくリンクされないので、整形する
      //httpが含まれないurlは絶対パスにする
      $(this).attr("href",fqdn_url + link);
      $(this).attr("target","_blank");
    };
  //$(this).nextUntil("section").wrapAll("<section></section>");
  //onsole.log($(this).attr("href"));
  });

  $(".slides img").each(function(){
    var link = $(this).attr("src");//スライド内のhrefを取得する
    if (link.indexOf('http') == -1) { //httpで始まらないリンクは正しくリンクされないので、整形する
      //httpが含まれないurlは絶対パスにする
      $(this).attr("src",fqdn_url + link);
    };
  });
};
