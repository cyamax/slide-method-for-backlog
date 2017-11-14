//http://qiita.com/Silphire/items/949b22cba0610ec9f40b
//新しいタブで開くためにbackgroundで実装

//初期設定
var history_url = [];
chrome.browserAction.setIcon({path:'off.png'});

function change_popup(tabid){
  chrome.tabs.get(tabid, function(tab){
    //console.log(tab.url);
    //backlogだけすスライドが作れるようにする
    if (tab.url.match(/\.backlog\.(jp|com)\/wiki\//)) {
      chrome.browserAction.setIcon({'path':'on.png'});
      chrome.browserAction.setPopup({'popup':''}); //あえて空白。新規タブで表示させるために空白
    } else {
      //backlog以外のとき
      chrome.browserAction.setIcon({'path':'off.png'});
      chrome.browserAction.setPopup({'popup':'test.html'});
    }
  });
};



chrome.tabs.onActiveChanged.addListener(function(tabid){ //タブが切り替わったら実行
  change_popup(tabid);
});


//開いているタブが更新したら
chrome.tabs.onUpdated.addListener(function(tabid){  //ページが更新されたら実行
  change_popup(tabid);
});


//現在アクティブなページがbacklogのとき & setpopupが空白のときにのみ有効
// setpopupが既に設定されている場合、onClicked.addListenerはchromeの仕様により無効化される
chrome.browserAction.onClicked.addListener(function(tab) {
  var date = new Date() ;
  var unixTimestamp = Math.floor( date.getTime() / 1000 ) ;
  var active_url= Array(3);  //現在開いているurl情報を入れる
  //var history_url = Array(11); //過去の履歴
  active_url = [unixTimestamp, tab.title, tab.url]; //保存時間、urlタイトル,url
  //history_url = [active_url, active_url];

  history_mod(active_url);

//  var urldata = {'time':history_url,'key': tab.url,'title':tab.title};

  chrome.tabs.create({'url':'slide_page.html'});
});




/////履歴管理
function history_mod(active_url){
  chrome.storage.local.get('data',function(value){
    // console.log(value.data );
    if (typeof(value.data) != 'undefined') {history_url = value.data};
    for (var i = 0;i < history_url.length ;i++){
      if (history_url[i][2] == active_url[2]){
        // console.log("削除前",history_url);
        history_url.splice(i,1);
        // console.log("削除後",history_url);
        i--;
      }
      //console.log(history_url[i][2]);
    };

    //追加(先頭に追加)
    history_url.unshift(active_url); //先頭に追加

    //11件以上の場合、一番古いレコードを消して10件にする
    if (history_url.length > 10){
      // console.log("over");
      history_url.splice(10,history_url.length-10);
    };

    var save_data = {'data':history_url};
    chrome.storage.local.set(save_data, function () {
      //console.log("save");
    });
  });
};
