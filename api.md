
Phim mới cập nhật
https://phim.nguonc.com/api/films/phim-moi-cap-nhat?page={page}

Phim theo danh mục
https://phim.nguonc.com/api/films/danh-sach/{slug}?page={page}

Chi tiết phim
https://phim.nguonc.com/api/film/{slug}

Phim theo thể loại
https://phim.nguonc.com/api/films/the-loai/{slug}?page={page}

Phim theo quốc gia
https://phim.nguonc.com/api/films/quoc-gia/{slug}?page={page}


Phim theo năm
https://phim.nguonc.com/api/films/nam-phat-hanh/{year}?page={page}


Tìm kiếm phim
https://phim.nguonc.com/api/films/search?keyword={keyword}


Cấu trúc phản hồi
{
  "status": "success",
  "paginate": {
    "current_page": 1,
    "total_page": 10,
    "total_items": 100,
    "items_per_page": 10
  },
  "items": []
}


Lưu ý tích hợp
Cache hợp lý
Lưu tạm phản hồi phù hợp với nhu cầu của ứng dụng và làm mới định kỳ.

Dùng slug ổn định
Lưu slug phim để gọi endpoint chi tiết thay vì phụ thuộc vào vị trí trong danh sách.


Xử lý lỗi mạng
Luôn có timeout, retry có khoảng nghỉ và giao diện dự phòng ở phía ứng dụng.