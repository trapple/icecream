// モデル: アイスクリーム一覧
var icecreamModel = {
  list: [
    {id: 't1', name:'バニラ'},
    {id: 't2', name:'チョコレートチップ'},
    {id: 't3', name:'オレンジシャーベット'},
    {id: 't4', name:'チョコミント'},
    {id: 't5', name:'ストロベリー'},
    {id: 't6', name:'抹茶'}
  ],
  // すべてのアイスクリームを返す
  getAll: function () {
    return this.list;
  },
  // IDで指定したアイスクリームオブジェクトを返す
  findById: function (id) {
    return $.grep(this.list, function (val) {
      return id == val.id;
    })[0];
  }
};

// モデル: 選択されているアイスクリームの管理
var selectionModel = {
  // 選択されているアイスクリームが入る
  list: [],

  // アイスクリームの個数
  icecreamNumber: 2,

  // アイスクリームの個数変更
  changeIcecreamNumber: function (n) {
    this.icecreamNumber = n;
    this.clear();
  },

  // アイスクリームを追加する
  add: function (item) {
    var list = this.list;
    list.push(item);
    if( list.length > this.icecreamNumber ){
      list.shift();
    }
    this.updateViews();
  },

  // 指定したアイスクリームが選択されていればtrue
  contain: function (icecream) {
    return this.list.indexOf(icecream) >= 0;
  },

  // IDで指定したアイスクリームが選択されていればtrue
  containById: function (id) {
    return this.contain(icecreamModel.findById(id));
  },

  // 選択されているアイスクリームを返す
  getIcecreams: function () {
    return this.list;
  },

  // ビューを更新
  updateViews: function () {
    updateSelection();
    updateIcecreamList();
  },

  // クリア
  clear: function () {
    this.list = []; 
    this.updateViews();
  }
};

//// 簡易テスト関数
//function ok(title, expect, value) {
//  if (expect === value) {
//    console.log("OK : " + title);
//  } else {
//    console.log("NG : " + title + " [" + expect + "] ---> [" + value + "]");
//  }
//}
//
//// テスト内容
//function testModels() {
//  var all = icecreamModel.getAll();
//  
//  ok("icecreamModel:length", all.length, 6);
//  ok("icecreamModel.findById", icecreamModel.findById("t4"), all[3]);
//
//  ok("selectionModel:最初の個数", selectionModel.getIcecreams().length, 0);
//  ok("selectionModel.contain:空の場合", false, selectionModel.contain(all[0]));
//
//  selectionModel.add(all[0]);
//  ok("selectionModel:1つめを追加した時の個数", selectionModel.getIcecreams().length, 1);
//  ok("selectionModel.contain:1つめを追加した時のチェック", true, selectionModel.contain(all[0]));
//
//  selectionModel.add(all[1]);
//  ok("selectionModel:2つめを追加した時の個数", selectionModel.getIcecreams().length, 2);
//  ok("selectionModel.contain:2つめを追加した時のチェック", true, selectionModel.contain(all[1]));
//
//  selectionModel.add(all[2]);
//  ok("selectionModel:3つめを追加した時の個数", selectionModel.getIcecreams().length, 2);
//  ok("selectionModel.contain:3つめを追加した時のチェック", true, selectionModel.contain(all[2]));
//  ok("selectionModel.contain:3つめを追加したら最初のものは消える", false, selectionModel.contain(all[0]));
//}
//
//testModels();

// アイスクリーム一覧を構築
$(function () {
  var els = $("#icecreams");
  $.each(icecreamModel.getAll(), function (i, icecream) {
    els.append(
      $('<div class="checkbox">').append( 
        $('<label>').append( 
          $("<input type='checkbox'>").attr('name', icecream.id)
          .click(
            // コントローラー呼び出し
            onclickIcecream
          )
        ).append(icecream.name)
      )
    ) // end of eld.append
  }); //end of each
  selectionModel.updateViews();

  $("#clear").click(function (event) {
    event.preventDefault();
    selectionModel.clear();
  });

  $("#number").change(function (event) {
    var selected = $(this).find("option:selected");
    selectionModel.changeIcecreamNumber(selected.val());
  });
});

// ビュー: チェックボックスを更新するビュー 
function updateSelection() {
  $("#icecreams input[type=checkbox]").each(function(i, elm){
    elm.checked = selectionModel.containById( elm.name ); 
  });
}

// ビュー: 選択順序を更新するビュー
function updateIcecreamList() {
  // 選択されたアイスクリーム一覧からアイスクリーム名を集めて表示
  $("#icecream-list").text(
    $.map(selectionModel.getIcecreams(), function (val) {
      return val.name;
    }).join(" > ")
  );
}

// コントローラー: GUIのイベントからモデルの更新に変換
function onclickIcecream(event) {
  var checkbox = $(this);
  if(checkbox){
    selectionModel.add(
      icecreamModel.findById(checkbox.attr("name"))  
    );
  }
}

