"use strict";

const calendarHeader = document.getElementById("js_calendar-header"); // カレンダーのヘッダー
const calendar = document.getElementById("js_calendar"); // カレンダー
const prevBtn = document.getElementById("js_prev-btn"); // 前のボタン
const nextBtn = document.getElementById("js_next-btn"); // 次のボタン

// タイマー
const timerbtn = document.getElementById("timer_btn"); // ストップウォッチのボタン
const timerElement = document.getElementById("timer");
const timerDataElement = document.getElementById("timer-display-data");
const timercountElement = document.getElementById("timer-display-count");
const timerstatrbtn = document.getElementById("timer-start-btn");
const timerstopbtn = document.getElementById("timer-stop-btn");
const timerbackbtn = document.getElementById("timer-back-btn");
const counteventmodal = document.getElementById("count-add-event-modal");
const counteventmodaldata = document.getElementById("count_add-event_date");
const counteventmodaltitle = document.getElementById("count_add-event_title");
const countaddEventTime = document.getElementsByClassName(
  "count_add-event_time"
);
const counteventmodaladdbtn = document.getElementById("count_add-event_btn");

// 詳細ウインドウ
let jsdetailwindowtxt;
const detailwindow = document.getElementById("detail-window");
const detailwindowbachbtn = document.getElementById("detail-window-back-btn");
const detailwindowdate = document.getElementById(
  "js-click-detail-date-classname"
);
const detailwindowdatewrapper = document.getElementById(
  "detail-window-event-wrapper"
);

const detailwindowtimercount = document.getElementById(
  "js-timer-count-time-content"
);

// イベント追加
const addEventTitle = document.getElementById("js_add-event_title");
const addEventDate = document.getElementById("js_add-event_date");
const addEventTime = document.getElementsByClassName("js_add-event_time");
const addEventBtn = document.getElementById("js_add-event_btn");

// イベント編集
let editEventId;
const EditEventTitle = document.getElementById("js_edit-event_title");
const EditEventDate = document.getElementById("js_edit-event_date");
const EditEventTime = document.getElementsByClassName("js_edit-event_time");
const EditEventBtn = document.getElementById("js_edit-event_btn");
const DeleteEventBtn = document.getElementById("js_delete-event_btn");

const week = ["日", "月", "火", "水", "木", "金", "土"]; // 曜日の配列
const today = new Date(); // 現在の日付オブジェクト
const thisYear = today.getFullYear(); // 現在の年
const thisMonth = today.getMonth(); // 現在の月
const thisDay = today.getDate(); // 現在の日

const firstDate = new Date(thisYear, thisMonth, 1);

// ページのロード時のイベント
window.addEventListener("load", () => {
  showCalendar();
  showEvents();
  timercreate();
  timercountcreate();
  createCalendar();
  calendardatedatailShow();
});

/**
 * ヘッダー
 */
// カレンダーヘッダーの先月へ移動イベント
prevBtn.addEventListener("click", (e) => {
  firstDate.setMonth(firstDate.getMonth() - 1);
  showCalendar();
  showEvents();
  calendardatedatailShow();
});

// カレンダーヘッダーの翌月へ移動イベント
nextBtn.addEventListener("click", (e) => {
  firstDate.setMonth(firstDate.getMonth() + 1);
  showCalendar();
  showEvents();
  calendardatedatailShow();
});

/**
 * モーダル
 */
// モーダルからイベントを追加する
addEventBtn.addEventListener("click", () => {
  let newId = 1;

  if (events.length > 0) {
    newId = Math.max(...events.map((item) => item.id)) + 1;

    console.log(newId);
  }
  // 1. events.map((item) => item.id) map メソッドを使用して、新しい配列を作成している。
  // 2. id を抽出 → [1, 2, 3] の配列を作成
  // 3. スプレッド構文を使用して、配列内ないから最大値を抽出（Math.max)
  // 4. 最大値に＋1 した値を newId として付与

  const eventFirstDate = new Date(
    `${addEventDate.value} ${addEventTime[0].value}`
  );

  // Mon Oct 02 2023 03:30:00 GMT+0900 (日本標準時)

  const eventEndDate = new Date(
    `${addEventDate.value} ${addEventTime[1].value}`
  );
  // Mon Oct 02 2023 00:00:00 GMT+0900 (日本標準時)

  // console.log(addEventDate.value); // 2023-10-02
  // console.log(addEventTime[0].value); // 03:30

  const event = {
    id: newId,
    title: addEventTitle.value,
    firstDate: eventFirstDate,
    // "2023-10-08 03:15"
    endDate: eventEndDate,
    // "2023-10-08 04:00"
  };

  events.push(event);

  console.log(events);

  showCalendar();
  showEvents();
});

// モーダルからイベントを編集する
EditEventBtn.addEventListener("click", () => {
  console.log(editEventId); // id
  console.log(EditEventTitle.value); // タイトル
  console.log(EditEventDate.value); // 日付
  console.log(EditEventTime[0].value); // 開始時間
  console.log(EditEventTime[1].value); // 終了時間

  const eventTitle = EditEventTitle.value;
  const eventFirstDate = new Date(
    `${EditEventDate.value} ${EditEventTime[0].value}`
  );
  const eventEndDate = new Date(
    `${EditEventDate.value} ${EditEventTime[1].value}`
  );

  console.log(eventTitle); // id
  console.log(eventFirstDate); // id
  console.log(eventEndDate); // id

  events = events.map((event) => {
    if (event.id === editEventId) {
      event.title = eventTitle;
      event.firstDate = eventFirstDate;
      event.endDate = eventEndDate;
    }
    return event;
  });

  showCalendar();
  showEvents();
  detailwindowshow();
});

// モーダルからイベントを削除する
DeleteEventBtn.addEventListener("click", () => {
  events = events.filter((event) => event.id !== editEventId);

  showCalendar(); // カレンダーを再表示
  showEvents(); // イベントを再表示
  detailwindowshow();
});

/**
 * カレンダーの作成
 */
const createCalendar = (year, month) => {
  const firstDayOfWeek = firstDate.getDay(); // 今月初日の曜日
  const lastDate = new Date(year, month + 1, 0); // 今月の末日日付オブジェクト（0と指定することで末日になる）
  const lastDay = lastDate.getDate(); // 今月の末日
  const lastDateOfLastMonth = new Date(year, month, 0); // 先月末日日付オブジェクト（0と指定することで末日になる）
  const lastDayOfLastMonth = lastDateOfLastMonth.getDate(); // 先月の末日

  // カレンダーの行数
  // 数値の結果の切り上げ((今月初日の曜日 + 今月末日) / 曜日の配列の長さ) 5 or 6が代入される
  const rowNumber = Math.ceil((firstDayOfWeek + lastDay) / week.length);
  let dayCount = 1;
  let calendarHtml = "";

  // 曜日表示のHTML生成
  calendarHtml += `<div class="calendar_table-head d-flex align-items-center">`;
  for (let i = 0; i < week.length; i++) {
    calendarHtml += `<div class="calendar_table-data">${week[i]}</div>`;
  }
  calendarHtml += "</div>";

  // カレンダーの日表示のHTML生成（行のループ）
  for (let w = 0; w < rowNumber; w++) {
    calendarHtml += `<div class="calendar_table-row d-flex">`;

    // カレンダーの日表示のHTML生成（列のループ）
    for (let d = 0; d < week.length; d++) {
      // 初週かつdが曜日の長さ未満
      if (w === 0 && d < firstDayOfWeek) {
        // 表を埋めるために前月末週の日付情報を出力（先月の末日 - 今月初日の曜日 + d + 1）
        const num = lastDayOfLastMonth - firstDayOfWeek + d + 1;
        calendarHtml += `<div class="calendar_table-data is-disabled p-1 calendar-date-detail"><span class="calendar_date">${num}</span></div>`;

        // dayCountが今月の末日を超えている
      } else if (dayCount > lastDay) {
        // 表を埋めるために翌月初週の日付情報を出力（dayCount - 今月の末日）
        const num = dayCount - lastDay;
        calendarHtml += `<div class="calendar_table-data is-disabled p-1 calendar-date-detail"><span class="calendar_date">${num}</span></div>`;
        dayCount++;

        // 今日の日付
      } else if (
        year === thisYear &&
        month === thisMonth &&
        dayCount === thisDay
      ) {
        calendarHtml += `<div class="calendar_table-data p-1 js_calendar-date calendar-date-detail"><span class="calendar_date calendar_date-current bg-primary text-white">${dayCount}</span></div>`;
        dayCount++;

        // 上記条件以外
      } else {
        calendarHtml += `<div class="calendar_table-data p-1 js_calendar-date calendar-date-detail"><span class="calendar_date">${dayCount}</span></div>`;
        dayCount++;
      }
    }
    calendarHtml += "</div>";
  }

  calendardatedatailShow();

  return calendarHtml;
};

/**
 * カレンダーの表示
 */
const showCalendar = () => {
  // ヘッダーに年・月の表示
  const yearMonthTxt = `${firstDate.getFullYear()}年${
    firstDate.getMonth() + 1
  }月`;
  calendarHeader.innerHTML = yearMonthTxt;

  // カレンダーの表示
  const calendarHtml = createCalendar(
    firstDate.getFullYear(),
    firstDate.getMonth()
  );
  calendar.innerHTML = calendarHtml;
};

/**
 * イベントをカレンダーに表示
 */
const showEvents = () => {
  // 現在の月と年のイベントを抽出
  const thisEvents = events.filter((event) => {
    const eventYear = new Date(event.firstDate).getFullYear();
    const eventMonth = new Date(event.firstDate).getMonth();

    return (
      firstDate.getFullYear() === eventYear &&
      firstDate.getMonth() === eventMonth
    );
  });

  const calendarDates = calendar.querySelectorAll(".js_calendar-date");

  // 抽出したイベントをカレンダーに表示
  thisEvents.forEach((event) => {
    const calendarDate = Array.from(calendarDates).find(
      (dateElm) =>
        Number(dateElm.firstChild.innerText) ===
        new Date(event.firstDate).getDate()
    );

    const badgeElm = document.createElement("span");
    badgeElm.classList.add("badge", "calendar_event");
    badgeElm.setAttribute("id", event.id);
    badgeElm.setAttribute("data-bs-toggle", "modal");
    badgeElm.setAttribute("data-bs-target", "#edit-event-modal");

    const firstDateHour = String(new Date(event.firstDate).getHours()).padStart(
      2,
      "0"
    );
    const firstDateMinute = String(
      new Date(event.firstDate).getMinutes()
    ).padStart(2, "0");

    badgeElm.innerText = `${firstDateHour}:${firstDateMinute} ${event.title}`;

    calendarDate.appendChild(badgeElm);

    // モーダルを開くためにdata-bs-toggle, targetに値を付与する
    badgeElm.setAttribute("data-bs-toggle", "modal");
    badgeElm.setAttribute("data-bs-target", "#edit-event-modal");

    // イベントのクリックイベント
    badgeElm.addEventListener("click", () => {
      // firstDate を Date オブジェクトに変換
      const firstDate = new Date(event.firstDate);
      // console.log(firstDate);
      // endDate を Date オブジェクトに変換
      const endDate = new Date(event.endDate);
      // console.log(endDate);

      editEventId = event.id; // id

      EditEventTitle.value = event.title; // タイトル
      EditEventDate.value = `${firstDate.getFullYear()}-${String(
        firstDate.getMonth() + 1
      ).padStart(2, "0")}-${String(firstDate.getDate()).padStart(2, "0")}`; // 日付

      EditEventTime[0].value = `${String(firstDate.getHours()).padStart(
        2,
        "0"
      )}:${String(firstDate.getMinutes()).padStart(2, "0")}`; // 開始時間
      EditEventTime[1].value = `${String(endDate.getHours()).padStart(
        2,
        "0"
      )}:${String(endDate.getMinutes()).padStart(2, "0")}`; // 終了時間
    });
  });

  calendardatedatailShow();
  calendarDatesMaxShow();
};

const calendarDatesMaxShow = () => {
  const calendarDates = calendar.querySelectorAll(".js_calendar-date");

  const maxToShow = 5; // 表示する要素の最大数

  calendarDates.forEach((element) => {
    const children = element.children;
    // children に対する操作を行う

    for (let i = maxToShow; i < children.length; i++) {
      children[i].style.display = "none"; // 5番目以降の要素を非表示にする
    }
  });
};

/**
 * Timer
 */
timerbtn.addEventListener("click", () => {
  if (timerElement.style.display === "none") {
    timerElement.style.display = "block"; // 表示
  } else {
    timerElement.style.display = "none"; // 非表示
  }
});

timerbackbtn.addEventListener("click", () => {
  timerElement.style.display = "none";
  startcount = "";

  if ((timerstopbtn.style.display = "inline-block")) {
    timerstatrbtn.style.display = "inline-block";
    timerstopbtn.style.display = "none";
  }
});

const timercreate = () => {
  const TimerTxt = `${today.getFullYear()}年${
    today.getMonth() + 1
  }月${today.getDate()}日`;
  timerDataElement.innerHTML = TimerTxt;

  const timercountcreate = () => {
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    // 時、分、秒を2桁表示に整形
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    // 時計表示部分を更新
    timercountElement.innerText = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };
};

const timercountcreate = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // 時、分、秒を2桁表示に整形
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  // 時計表示部分を更新
  timercountElement.innerText = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
setInterval(timercountcreate, 1000);

let startcount;
timerstatrbtn.addEventListener("click", function () {
  timerstopbtn.style.display = "inline-block";
  timerstatrbtn.style.display = "none";

  startcount = timercountElement.innerText;
});

let stopcount;
timerstopbtn.addEventListener("click", function () {
  timerstatrbtn.style.display = "inline-block";
  timerstopbtn.style.display = "none";

  stopcount = timercountElement.innerText;

  countaddEventTime[0].innerHTML = `${startcount}`;
  countaddEventTime[1].innerHTML = `${stopcount}`;

  // 追加ボタンを押した後にウインドウを閉じる
  if (timerElement.style.display === "none") {
    timerElement.style.display = "block"; // 表示
  } else {
    timerElement.style.display = "none"; // 非表示
  }
});

counteventmodaladdbtn.addEventListener("click", () => {
  // newId
  let newId = 1;

  if (events.length > 0) {
    newId = Math.max(...events.map((item) => item.id)) + 1;

    console.log(newId);
  }

  // firstDate を新しい Date オブジェクトに書き換え
  // 共通
  let originalDateString = today;
  let originalDate = new Date(originalDateString);

  // firstDate
  let newfirstDatetime = countaddEventTime[0].textContent.trim();
  var newfirstDateParts = newfirstDatetime.split(":");
  var newfirstDateHour = parseInt(newfirstDateParts[0]);
  var newfirstDateMinute = parseInt(newfirstDateParts[1]);
  var newfirstDateSecond = parseInt(newfirstDateParts[2]);

  originalDate.setHours(newfirstDateHour);
  originalDate.setMinutes(newfirstDateMinute);
  originalDate.setSeconds(newfirstDateSecond);

  var newnewfirstDateString = originalDate.toString();
  console.log(newnewfirstDateString);

  // endDate
  let newendDatetime = countaddEventTime[1].textContent.trim();
  var newendDateParts = newendDatetime.split(":");
  var newendDateHour = parseInt(newendDateParts[0]);
  var newendDateMinute = parseInt(newendDateParts[1]);
  var newendDateSecond = parseInt(newendDateParts[2]);

  originalDate.setHours(newendDateHour);
  originalDate.setMinutes(newendDateMinute);
  originalDate.setSeconds(newendDateSecond);

  var newnewendDateString = originalDate.toString();

  console.log(newnewendDateString);

  // event に push
  const event = {
    id: newId,
    title: counteventmodaltitle.value,
    firstDate: newnewfirstDateString,
    endDate: newnewendDateString,
  };

  events.push(event);

  console.log(events);

  showCalendar();
  showEvents();
  calendardatedatailShow();
});

// 詳細ウインドウ
// 詳細ウインドウの表示・非表示
detailwindowbachbtn.addEventListener("click", () => {
  if (detailwindow.style.display === "none") {
    detailwindow.style.display = "block"; // 表示
  } else {
    detailwindow.style.display = "none"; // 非表示
    detailwindowdatewrapper.innerHTML = ""; // 内容をクリア
  }
});

function calendardatedatailShow() {
  const calendardatedatail = document.getElementsByClassName(
    "calendar-date-detail"
  );
  for (let i = 0; i < calendardatedatail.length; i++) {
    calendardatedatail[i].addEventListener("click", handleCellClick);
    console.log();
  }
}

function handleCellClick(event) {
  // 詳細ウインドウに日付表示
  const clickedElement = event.target;

  if (clickedElement.classList.contains("calendar-date-detail")) {
    const spanElement = clickedElement.querySelector("span");

    if (spanElement) {
      console.log("Span clicked:", spanElement.textContent);

      // 処理用に日付のフォーマット変換
      jsdetailwindowtxt = `${calendarHeader.textContent.replace(
        /年|月/g,
        "-"
      )}${spanElement.textContent}`;

      // 詳細ウインドウに日付を表示する
      console.log(detailwindowdate);
      let detailshowdatetxt = `${calendarHeader.textContent}${spanElement.textContent}日`;
      detailwindowdate.innerText = detailshowdatetxt;

      createdetailwindowbadgeElm();

      if (detailwindow.style.display === "none") {
        detailwindow.style.display = "block"; // 表示
        console.log("block");
        detailwindowshow();
      } else {
        // 詳細ウィンドウを非表示にし、内容をクリアする
        detailwindow.style.display = "none";
        detailwindowdatewrapper.innerHTML = ""; // 内容をクリア

        console.log("none");
      }
    }
  }
}

const createdetailwindowbadgeElm = () => {
  const thisEvents = events.filter((event) => {
    //events 配列から条件に会うものを探しfilter、return で event に戻り値として渡したものを thisEvents に格納

    const eventYear = new Date(event.firstDate).getFullYear();
    const eventMonth = new Date(event.firstDate).getMonth() + 1;
    const eventdate = new Date(event.firstDate).getDate();

    return (
      eventYear === new Date(jsdetailwindowtxt).getFullYear() &&
      eventMonth === new Date(jsdetailwindowtxt).getMonth() + 1 &&
      eventdate === new Date(jsdetailwindowtxt).getDate()
    );
  });

  thisEvents.forEach((event) => {
    const badgeElm = document.createElement("span");
    badgeElm.classList.add("badge", "calendar_event", "badge_detailwindow");
    badgeElm.setAttribute("id", event.id);

    const firstDateHour = String(new Date(event.firstDate).getHours()).padStart(
      2,
      "0"
    );
    const firstDateMinute = String(
      new Date(event.firstDate).getMinutes()
    ).padStart(2, "0");

    const endDateHour = String(new Date(event.endDate).getHours()).padStart(
      2,
      "0"
    );
    const endDateMinute = String(new Date(event.endDate).getMinutes()).padStart(
      2,
      "0"
    );

    badgeElm.innerText = `${firstDateHour}:${firstDateMinute} - ${endDateHour}:${endDateMinute} ${event.title}`;

    detailwindowdatewrapper.appendChild(badgeElm);

    // モーダルを開くためにdata-bs-toggle, targetに値を付与する
    badgeElm.setAttribute("data-bs-toggle", "modal");
    badgeElm.setAttribute("data-bs-target", "#edit-event-modal");

    // イベントのクリックイベント
    badgeElm.addEventListener("click", () => {
      // firstDate を Date オブジェクトに変換
      const firstDate = new Date(event.firstDate);
      // console.log(firstDate);
      // endDate を Date オブジェクトに変換
      const endDate = new Date(event.endDate);
      // console.log(endDate);

      editEventId = event.id; // id

      EditEventTitle.value = event.title; // タイトル
      EditEventDate.value = `${firstDate.getFullYear()}-${String(
        firstDate.getMonth() + 1
      ).padStart(2, "0")}-${String(firstDate.getDate()).padStart(2, "0")}`; // 日付

      EditEventTime[0].value = `${String(firstDate.getHours()).padStart(
        2,
        "0"
      )}:${String(firstDate.getMinutes()).padStart(2, "0")}`; // 開始時間
      EditEventTime[1].value = `${String(endDate.getHours()).padStart(
        2,
        "0"
      )}:${String(endDate.getMinutes()).padStart(2, "0")}`; // 終了時間
    });
  });
};

const detailwindowshow = () => {
  const thisEvents = events.filter((event) => {
    //events 配列から条件に会うものを探しfilter、return で event に戻り値として渡したものを thisEvents に格納

    const eventYear = new Date(event.firstDate).getFullYear();
    const eventMonth = new Date(event.firstDate).getMonth() + 1;
    const eventdate = new Date(event.firstDate).getDate();

    return (
      eventYear === new Date(jsdetailwindowtxt).getFullYear() &&
      eventMonth === new Date(jsdetailwindowtxt).getMonth() + 1 &&
      eventdate === new Date(jsdetailwindowtxt).getDate()
    );
  });

  console.log(thisEvents);

  // 合計時間の初期化
  let totalHours = 0;
  let totalMinutes = 0;

  // 開始日時と終了日時の合計時間の計算
  thisEvents.forEach((event) => {
    const startDate = new Date(event.firstDate);
    const endDate = new Date(event.endDate);

    // 開始日時から終了日時までの時間をミリ秒で計算
    const durationInMillis = endDate - startDate;

    // ミリ秒から時間と分に換算
    const hours = Math.floor(durationInMillis / (1000 * 60 * 60));
    const minutes = Math.floor(
      (durationInMillis % (1000 * 60 * 60)) / (1000 * 60)
    );

    // 合計時間に加算
    totalHours += hours;
    totalMinutes += minutes;

    // 分が60以上の場合、時間に換算して補正
    if (totalMinutes >= 60) {
      totalHours += Math.floor(totalMinutes / 60);
      totalMinutes %= 60;
    }
  });

  console.log(totalHours);

  // 合計時間が24時間以上の場合、24時間から引く
  if (totalHours >= 24) {
    totalHours = totalHours % 24;
  }

  if (totalHours < 0) {
    totalHours = totalHours + 24;
  }

  // 計算結果の出力
  console.log(`合計時間: ${totalHours} 時間 ${totalMinutes} 分`);
  detailwindowtimercount.textContent = `${totalHours} 時間 ${totalMinutes} 分`;
};

let events = [
  {
    id: 0,
    title: "テスト",
    firstDate: "Wed Feb 14 2024 09:23:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 14 2024 10:21:00 GMT+0900 (日本標準時)",
  },

  {
    id: 1,
    title: "睡眠",
    firstDate: "Wed Mar 3 2024 00:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Mar 3 2024 09:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 2,
    title: "おひるごはん",
    firstDate: "Wed Mar 3 2024 12:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Mar 3 2024 13:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 3,
    title: "掃除",
    firstDate: "Wed Mar 3 2024 10:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Mar 3 2024 10:30:00 GMT+0900 (日本標準時)",
  },
  {
    id: 4,
    title: "イベント3",
    firstDate: "Wed Feb 16 2024 22:34:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 16 2024 23:24:00 GMT+0900 (日本標準時)",
  },
  {
    id: 5,
    title: "イベント4",
    firstDate: "Wed Feb 17 2024 23:00:00 GMT+0900 (日本標準時)",
    endDate: "Thu Feb 17 2024 00:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 6,
    title: "イベント5",
    firstDate: "Thu Feb 18 2024 01:00:00 GMT+0900 (日本標準時)",
    endDate: "Thu Feb 18 2024 02:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 7,
    title: "テスト",
    firstDate: "Wed Feb 14 2024 11:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 14 2024 12:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 8,
    title: "勉強",
    firstDate: "Wed Mar 3 2024 14:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Mar 3 2024 16:30:00 GMT+0900 (日本標準時)",
  },
  {
    id: 8,
    title: "テスト",
    firstDate: "Wed Feb 14 2024 17:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 14 2024 19:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 9,
    title: "睡眠",
    firstDate: "Wed Feb 26 2024 00:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 08:00:00 GMT+0900 (日本標準時)",
  },

  {
    id: 10,
    title: "身支度",
    firstDate: "Wed Feb 26 2024 08:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 08:30:00 GMT+0900 (日本標準時)",
  },

  {
    id: 11,
    title: "朝ごはん",
    firstDate: "Wed Feb 26 2024 08:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 09:00:00 GMT+0900 (日本標準時)",
  },

  {
    id: 12,
    title: "仕事（午前）",
    firstDate: "Wed Feb 26 2024 09:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 12:00:00 GMT+0900 (日本標準時)",
  },

  {
    id: 13,
    title: "おひるごはん",
    firstDate: "Wed Feb 26 2024 12:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 13:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 14,
    title: "仕事（午後）",
    firstDate: "Wed Feb 26 2024 13:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 18:00:00 GMT+0900 (日本標準時)",
  },

  {
    id: 15,
    title: "ジム",
    firstDate: "Wed Feb 26 2024 19:00:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 20:30:00 GMT+0900 (日本標準時)",
  },

  {
    id: 16,
    title: "夜ごはん",
    firstDate: "Wed Feb 26 2024 20:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 21:00:00 GMT+0900 (日本標準時)",
  },

  {
    id: 17,
    title: "夜ごはん",
    firstDate: "Wed Feb 26 2024 20:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 21:00:00 GMT+0900 (日本標準時)",
  },
  {
    id: 18,
    title: "夜ごはん",
    firstDate: "Wed Feb 26 2024 22:30:00 GMT+0900 (日本標準時)",
    endDate: "Wed Feb 26 2024 23:30:00 GMT+0900 (日本標準時)",
  },
];
