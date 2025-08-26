$("a.maps-ab#backan").hover(
    function() {
        $(this).append($("<div class=title-maps> <div class=general>  <h2 class=name-province>Mộc Châu </h2> <div class=introduce-province> Cao nguyên Mộc Châu được gọi bằng một cái tên rất ưu ái, đó là ‘’Đà Lạt Tây Bắc” bởi khí hậu không khí quanh năm mát mẻ dễ chịu. Phù hợp đón khách du lịch mọi thời điểm trong năm </div> </div> <a class=more-info href=./detail-maps.html > More infor </a> </div>"));
    },
    function() {
        $(this).find(".title-maps").last().remove();
    }
);
$(".maps-ab#hanoi").hover(
    function() {
        $(this).append($("<div class=title-maps> <div class=general>  <h2 class=name-province> Hà Nội </h2> <ul class=infor-province> <div class=introduce-province> Hà Nội là thủ đô của nước Cộng hòa Xã hội chủ nghĩa Việt Nam, cũng là kinh đô của hầu hết các vương triều phong kiến tại Việt Nam trước đây. Do đó, lịch sử Hà Nội gắn liền với sự thăng trầm của lịch sử Việt Nam qua các thời kỳ. Hà Nội là thành phố trực thuộc trung ương có diện tích lớn nhất cả nước với mật độ dân số là khoảng 8 triệu người. </div> </div> <a class=more-info href=./detail-maps.html > More infor </a> </div>"));
    },
    function() {
        $(this).find(".title-maps").last().remove();
    }
);