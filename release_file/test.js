var history_url = []; //chrome.storageから持ってきたurl情報各種
chrome.storage.local.get(function(value){
  // console.log(value.data);
  if (typeof(value.data) != 'undefined') {
    history_url = value.data;
    for (var i = 0;i < history_url.length ;i++){
      $('.rounded-list').append('<a target="_blank" href="'+history_url[i][2]+'"><li>'+history_url[i][1]+'</li></a>');
    };
  } else {
    var show_message="履歴はありません";
    $('#history_list').text(show_message);
  };
  // histroy_link
});
