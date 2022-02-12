
function isMobile() {
    var UserAgent = navigator.userAgent;

    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null) {
        return true;
    } else {
        return false;
    }
}

if (!isMobile()) {
    alert("본 웹사이트는 모바일에 최적화되어 있습니다.");
}

function checkLine(line) {
    if (line == "1호선" || line == "2호선" || line == "3호선" || line == "4호선" || line == "5호선"
        || line == "6호선" || line == "7호선" || line == "8호선" || line == "9호선"
        || line == "공항철도" || line == "우이신설선" || line == "신분당선" || line == "경춘선") {
        return true;
    } else {
        return false;
    }
}

function getLineData(line) {
    $.ajax({
        url: `http://swopenapi.seoul.go.kr/api/subway/4842436e50676a643439624f646761/xml/realtimePosition/0/1000/${line}`, // 읽어올 문서 
        type: 'GET', // 방식 
        dataType: 'xml', // 문서 타입 
        timeout: 1000, // 시간 설정 
        target: '_blank',
        error: function () { // 로딩 에러시 
            alert('Error loading XML document');
        }, success: function (xml) {
            let contents = ` [${line} 실시간 열차 알림] <br /><hr />`;
            $(xml).find('row').each(function () {
                var trainNo = $(this).find("trainNo").text(); // 열번
                var updnline = $(this).find("updnLine").text(); // 상하행선 구분
                var statnNm = $(this).find("statnNm").text() + "역"; // 열차 위치
                var recptnDt = $(this).find("recptnDt").text(); // 업데이트 시간
                var statnTnm = $(this).find("statnTnm").text() + "역행"; // 종착역
                var trainSttus = $(this).find("trainSttus").text(); // 열차 상태
                var directAt = $(this).find("directAt").text(); // 열차 구분 (급행, 일반)
                var lstcarAt = $(this).find("lstcarAt").text(); // 막차 여부


                if (line == "2호선" && $(this).find("updnLine").text() == "0") {
                    updnline = "외선순환";
                } else if (line == "2호선" && $(this).find("updnLine").text() == "1") {
                    updnline = "내선순환";
                } else if (line == "공항철도" && $(this).find("updnLine").text() == "0") {
                    updnline = "하행";
                } else if (line == "공항철도" && $(this).find("updnLine").text() == "1") {
                    updnline = "상행";
                } else if (line != "2호선" && line != "공항철도" && $(this).find("updnLine").text() == "0") {
                    updnline = "상행";
                } else if (line != "2호선" && line != "공항철도" && $(this).find("updnLine").text() == "1") {
                    updnline = "하행";
                } else {
                    updnline = "알 수 없음";
                }

                if ($(this).find("trainSttus").text() == "0") {
                    trainSttus = "진입";
                } else if ($(this).find("trainSttus").text() == "1") {
                    trainSttus = "도착";
                } else {
                    trainSttus = "출발";
                }

                if ($(this).find("directAt").text() == "0") {
                    directAt = "일반열차 ";
                } else if ($(this).find("directAt").text() == "1") {
                    directAt = "급행열차 ";
                } else {
                    directAt = "알 수 없음";
                }

                if ($(this).find("lstcarAt").text() == "0") {
                    lstcarAt = "";
                } else if ($(this).find("lstcarAt").text() == "1") {
                    lstcarAt = "(마지막 열차)";
                } else {
                    lstcarAt = "알 수 없음";
                }

                contents +=
                    `
                        #${trainNo} (${statnTnm}, ${updnline}) ${directAt} ${lstcarAt} <br />
                        열차 상태 : ${statnNm} ${trainSttus}<br />
                        업데이트 시간 : ${recptnDt}
                        <hr />
                    `;
            });

            $("#chat").append(
                `<li class="clearfix">
                            <div class="message-data text-right">
                                <span class="message-data-time">Today</span>
                                <img src="https://blog.kakaocdn.net/dn/biQ6Vq/btraVoKV4Bq/JKemnd8Kiblq3ijOgYNcA1/img.png" alt="avatar">
                            </div>
                            <div class="message other-message float-right">
                                ${contents}
                                <br />
                                <strong>본 정보는 100% 정확한 실시간 정보가 아닙니다.</strong>
                            </div>
                        </li>
                    `);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });
}

function go() {
    const line = document.getElementById('line').value;
    document.getElementById("line").value = "";

    if (checkLine(line)) {
        getLineData(line);
    } else {
        alert("호선 번호를 정확하게 입력해주세요.")
    }


}
