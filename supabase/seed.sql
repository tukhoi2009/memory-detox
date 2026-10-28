-- =============================================================================
-- MEMORY DETOX — Seed dữ liệu mẫu (chạy sau schema.sql)
-- =============================================================================

-- Danh mục bài học (5 category theo thiết kế Home)
insert into public.categories (slug, name, color_code, icon_name, sort_order) values
  ('scroll-habit', 'Phá vỡ thói quen lướt', '#D9F27E', 'phone', 1),
  ('fleeting-content', 'Nội dung biến mất nhanh', '#FBCFE8', 'eye', 2),
  ('reasoning-traps', 'Bẫy suy luận đánh lừa', '#BAE6FD', 'brain-hands', 3),
  ('focus-noise', 'Giữ tập trung khi nhiễu', '#D9F27E', 'flower-brain', 4),
  ('sustainable-memory', 'Ghi nhớ bền vững', '#FBCFE8', 'brain-leaves', 5)
on conflict (slug) do update set
  name = excluded.name,
  color_code = excluded.color_code,
  icon_name = excluded.icon_name,
  sort_order = excluded.sort_order;

-- Thành tích mẫu
insert into public.achievements (slug, title, description, requirement_type, requirement_value, sort_order) values
  ('first_lesson', 'Bước đầu tiên', 'Hoàn thành bài học đầu tiên', 'lessons_completed', 1, 1),
  ('points_100', 'Tích lũy 100 XP', 'Đạt 100 điểm kinh nghiệm', 'points', 100, 2),
  ('points_500', 'Nhà vô địch', 'Đạt 500 điểm kinh nghiệm', 'points', 500, 3),
  ('streak_3', 'Kiên trì 3 ngày', 'Luyện tập 3 ngày liên tiếp', 'streak_days', 3, 4)
on conflict (slug) do nothing;

-- Nội dung pháp lý / hỗ trợ (cập nhật nội dung thật trong Dashboard sau)
insert into public.app_content (slug, title, content) values
  (
    'faq',
    'Câu hỏi thường gặp',
    'MEMORY DETOX giúp bạn rèn luyện trí nhớ qua các bài học ngắn và trò chơi quiz. Hoàn thành bài học để nhận XP và leo bảng xếp hạng.'
  ),
  (
    'terms',
    'Điều khoản & Điều kiện',
    'Nội dung điều khoản sử dụng. Vui lòng cập nhật bản chính thức trước khi phát hành app.'
  ),
  (
    'privacy',
    'Chính sách bảo mật',
    'Chúng tôi chỉ thu thập dữ liệu cần thiết cho tài khoản và tiến độ học tập. Vui lòng cập nhật bản chính thức trước khi phát hành app.'
  ),
  (
    'support',
    'Liên hệ hỗ trợ',
    'Email: support@memorydetox.app'
  )
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  updated_at = now();

-- Xóa bài học legacy (seed cũ) — tránh trùng sort_order với 8 cấp mới
delete from public.lessons l
using public.categories c
where l.category_id = c.id
  and c.slug = 'sustainable-memory'
  and l.title in (
    'Giới thiệu trí nhớ ngắn hạn',
    'Kỹ thuật hình ảnh',
    'Luyện tập ghép cặp'
  );

-- Phá vỡ thói quen lướt — 8 cấp độ (luồng đọc + ghi nhớ)
insert into public.lessons (category_id, title, summary, content, hint, sort_order, is_locked, unlock_min_points, points_reward)
select
  c.id,
  'Cấp độ ' || v.sort_order,
  'Đọc tập trung và tái hiện ý chính.',
  v.content,
  v.hint,
  v.sort_order,
  false,
  0,
  v.points_reward
from public.categories c
cross join (
  values
    (
      1,
      'Một nghiên cứu gần đây cho thấy hầu hết mọi người đọc trên màn hình theo kiểu "lướt" thay vì đọc sâu. Khi não không dừng lại đủ lâu, trí nhớ làm việc không kịp ghi nhận. Hãy đọc chậm và tự hỏi: ý chính là gì?',
      'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.',
      25
    ),
    (2, 'Thói quen lướt khiến não quen với kích thích nhanh. Để phá vỡ, hãy đặt mục tiêu đọc một đoạn duy nhất và tóm tắt lại trước khi chuyển màn hình.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (3, 'Đọc sâu không có nghĩa là đọc lâu hơn mọi lúc — mà là đọc có chủ đích: dừng, suy ngẫm, và kiểm tra lại trí nhớ.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (4, 'Khi bạn không thể cuộn màn hình, não buộc phải xử lý từng ý. Đó là luyện tập tốt cho trí nhớ làm việc và khả năng tập trung.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (5, 'Nội dung ngắn trên mạng thường thiếu ngữ cảnh. Ghi nhớ bền cần bạn chủ động nối các ý với kinh nghiệm cá nhân.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (6, 'Mỗi lần bạn tóm tắt bằng từ khóa, não tạo thêm đường dẫn trí nhớ — giúp nhớ lâu hơn so với chỉ đọc lướt.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (7, 'Tập trung là cơ bắp: càng luyện đọc có chủ đích, càng dễ nhận ra khi nào mình đang "lướt" vô thức.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 25),
    (8, 'Hoàn thành cấp cuối: hãy áp dụng kỹ thuật đọc-chậm-tóm-tắt vào một bài đọc thật trong ngày hôm nay.', 'Viết 3 ý chính bằng từ khóa trong đoạn văn bạn vừa đọc được.', 30)
) as v(sort_order, content, hint, points_reward)
where c.slug = 'scroll-habit'
  and not exists (
    select 1 from public.lessons l
    where l.category_id = c.id and l.sort_order = v.sort_order
  );

-- Nội dung biến mất nhanh — 8 cấp (quan sát biểu đồ + tái hiện)
insert into public.lessons (category_id, title, summary, content, hint, sort_order, is_locked, unlock_min_points, points_reward)
select
  c.id,
  'Cấp độ ' || v.sort_order,
  'Ghi nhớ biểu đồ trước khi nội dung biến mất.',
  v.content,
  v.hint,
  v.sort_order,
  false,
  0,
  v.points_reward
from public.categories c
cross join (
  values
    (1, 'Quan sát biểu đồ doanh số 6 tháng và ghi nhớ từng cột.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (2, 'Chú ý tháng cao nhất và tháng thấp nhất trên biểu đồ.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (3, 'Ghi nhớ cả giá trị số và ghi chú đi kèm.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (4, 'Biểu đồ sẽ biến mất — hãy quan sát thật kỹ trong thời gian cho phép.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (5, 'So sánh xu hướng tăng giảm giữa các tháng.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (6, 'Tập trung vào màu và chiều cao từng cột.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (7, 'Thử ghi nhớ tổng doanh số 6 tháng trong phần ghi chú.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 25),
    (8, 'Cấp cuối: tái hiện chính xác nhất có thể.', 'Kéo thả các cột để tái hiện biểu đồ đúng như bạn nhớ.', 30)
) as v(sort_order, content, hint, points_reward)
where c.slug = 'fleeting-content'
  and not exists (
    select 1 from public.lessons l
    where l.category_id = c.id and l.sort_order = v.sort_order
  );

-- Bẫy suy luận đánh lừa — 8 cấp (đọc + trắc nghiệm, mỗi cấp một kịch bản)
insert into public.lessons (category_id, title, summary, content, hint, sort_order, is_locked, unlock_min_points, points_reward)
select
  c.id,
  'Cấp độ ' || v.sort_order,
  'Đọc kỹ và tránh suy luận theo thông tin gây nhiễu.',
  v.content,
  v.hint,
  v.sort_order,
  false,
  0,
  v.points_reward
from public.categories c
cross join (
  values
    (
      1,
      'Minh là nhân viên văn phòng, thường đi làm đúng giờ và ít nói. Gần đây anh bắt đầu ở lại muộn và kiểm tra lại công việc nhiều lần hơn. Một số đồng nghiệp cho rằng Minh đang cố gắng để được thăng chức. Người khác lại nghĩ anh đang gặp vấn đề về hiệu suất. Tuy nhiên, không có bằng chứng cho thấy hiệu suất trước đây của Minh kém.',
      'Chọn đáp án dựa trên bằng chứng trong đoạn văn.',
      25
    ),
    (
      2,
      'Bà Lan 80 tuổi uống cà phê mỗi sáng và vẫn khỏe mạnh. Hàng xóm kết luận: "Uống cà phê mỗi ngày sẽ sống lâu như bà Lan." Tuy nhiên, tuổi thọ phụ thuộc nhiều yếu tố như gen, vận động, dinh dưỡng và y tế — không thể suy ra từ một thói quen duy nhất.',
      'Tránh nhầm tương quan với nhân quả.',
      25
    ),
    (
      3,
      'Sau chiến dịch quảng cáo mới, doanh số công ty tăng 20%. Giám đốc marketing khẳng định quảng cáo là nguyên nhân duy nhất. Trong cùng kỳ, đối thủ gặp sự cố cung ứng và mùa mua sắm cũng bắt đầu — có thể cùng ảnh hưởng đến doanh số.',
      'Xem xét các yếu tố thay thế trước khi kết luận.',
      25
    ),
    (
      4,
      'Trong lớp, hầu hết học sinh đeo kính đạt điểm toán cao. Một phụ huynh cho rằng đeo kính giúp thông minh hơn. Thực tế, điểm số phụ thuộc luyện tập, phương pháp học và sự tập trung — không liên quan trực tiếp đến việc đeo kính.',
      'Phân biệt tương quan ngẫu nhiên và quan hệ nhân quả.',
      25
    ),
    (
      5,
      'Ứng dụng học ngoại ngữ có hàng nghìn đánh giá 5 sao. Người dùng mới cho rằng app chắc chắn hiệu quả với mọi người. Nhưng người bỏ app sớm thường không để lại đánh giá — mẫu dữ liệu có thể thiên lệch.',
      'Cẩn trọng với bằng chứng một chiều.',
      25
    ),
    (
      6,
      'Anh trai bắt đầu hút thuốc sau khi thay đổi công việc căng thẳng. Em gái kết luận: "Chắc công việc mới khiến anh hút thuốc." Có thể đúng, nhưng cũng có thể do áp lực xã hội, thói quen cũ tái phát hoặc nhiều nguyên nhân khác — chưa đủ dữ kiện để chắc chắn.',
      'Tránh vội gán một nguyên nhân duy nhất.',
      25
    ),
    (
      7,
      'Công ty A chuyển sang làm việc từ xa và báo cáo năng suất tăng. CEO công ty B tuyên bố mọi doanh nghiệp đều nên làm remote. Quy mô, ngành nghề và văn hóa tổ chức khác nhau — một mẫu thành công không đảm bảo áp dụng được cho tất cả.',
      'Không khái quát hóa vội từ một trường hợp.',
      25
    ),
    (
      8,
      'Một tin tức lan truyền mạnh trên mạng xã hội khiến nhiều người tin ngay mà không kiểm chứng nguồn. Số lượt chia sẻ lớn không đồng nghĩa thông tin chính xác — cần đối chiếu nguồn đáng tin cậy trước khi tin.',
      'Độ phổ biến không phải bằng chứng về sự thật.',
      30
    )
) as v(sort_order, content, hint, points_reward)
where c.slug = 'reasoning-traps'
  and not exists (
    select 1 from public.lessons l
    where l.category_id = c.id and l.sort_order = v.sort_order
  );

insert into public.quizzes (lesson_id, question, options, correct_index, question_index)
select
  l.id,
  v.question,
  v.options::jsonb,
  v.correct_index,
  0
from public.lessons l
join public.categories c on c.id = l.category_id
join (
  values
    (
      1,
      'Điều nào giải thích hợp lý nhất cho hành vi gần đây của Minh?',
      '["Minh đang cố gắng để được thăng chức","Minh đang gặp vấn đề về hiệu suất","Minh đang trở nên cẩn trọng hơn trong công việc","Minh không còn quan tâm đến công việc"]',
      2
    ),
    (
      2,
      'Kết luận "uống cà phê mỗi ngày sẽ sống lâu" của hàng xóm mắc lỗi gì?',
      '["Nhầm tương quan với nhân quả","Bỏ qua bằng chứng trái chiều","Suy luận từ một mẫu quá nhỏ","Không có lỗi logic rõ ràng"]',
      0
    ),
    (
      3,
      'Giám đốc marketing đã bỏ qua điều gì khi kết luận?',
      '["Chi phí quảng cáo quá cao","Các yếu tố khác cũng có thể làm tăng doanh số","Khách hàng không thích sản phẩm","Doanh số thực ra không tăng"]',
      1
    ),
    (
      4,
      'Nhận định "đeo kính giúp thông minh" dựa trên quan sát nào không đáng tin?',
      '["Học sinh đeo kính điểm toán cao nên kính gây thông minh","Điểm toán phụ thuộc luyện tập, không phụ thuộc kính","Kính chỉ dùng khi mắt kém","Phụ huynh lo lắng quá mức"]',
      1
    ),
    (
      5,
      'Vì sao nhiều đánh giá 5 sao không chứng minh app hiệu quả với mọi người?',
      '["App luôn miễn phí","Người bỏ app sớm ít khi đánh giá — mẫu bị thiên lệch","Đánh giá 5 sao là giả","App chỉ dành cho trẻ em"]',
      1
    ),
    (
      6,
      'Em gái đã mắc lỗi suy luận nào?',
      '["Tin vào truyền thông","Gán một nguyên nhân duy nhất khi chưa đủ bằng chứng","Phủ nhận tác hại thuốc lá","So sánh với bạn bè"]',
      1
    ),
    (
      7,
      'CEO công ty B đã phạm lỗi logic gì?',
      '["Khái quát hóa vội từ một trường hợp thành công","Từ chối công nghệ mới","Không đọc báo cáo tài chính","Chỉ tin lời nhân viên"]',
      0
    ),
    (
      8,
      'Điều nào là cách phản ứng hợp lý nhất với tin lan truyền mạnh?',
      '["Chia sẻ ngay vì nhiều người tin","Tin vì có hình ảnh minh họa","Kiểm chứng nguồn đáng tin trước khi tin","Chỉ tin nếu bạn bè chia sẻ"]',
      2
    )
) as v(sort_order, question, options, correct_index) on v.sort_order = l.sort_order
where c.slug = 'reasoning-traps'
  and not exists (
    select 1 from public.quizzes q where q.lesson_id = l.id
  );

-- Giữ tập trung khi nhiễu — 8 cấp (đọc có nhiễu + kể lại, mỗi cấp một chủ đề)
insert into public.lessons (category_id, title, summary, content, hint, sort_order, is_locked, unlock_min_points, points_reward)
select
  c.id,
  'Cấp độ ' || v.sort_order,
  'Đọc và ghi nhớ dù bị phân tâm.',
  v.content,
  v.hint,
  v.sort_order,
  false,
  0,
  v.points_reward
from public.categories c
cross join (
  values
    (
      1,
      'Năng lượng mặt trời là nguồn năng lượng sạch và tái tạo. Các tấm pin mặt trời chuyển đổi ánh sáng Mặt Trời thành điện năng. Ưu điểm là giảm phát thải carbon và tiết kiệm chi phí điện. Tuy nhiên, hiệu suất phụ thuộc thời tiết và diện tích lắp đặt.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      2,
      'Rác nhựa trong đại dương là mối đe dọa lớn cho hệ sinh thái biển. Mỗi năm hàng triệu tấn nhựa thải ra môi trường, làm hại sinh vật biển và đi vào chuỗi thức ăn. Giải pháp gồm giảm dùng nhựa một lần, tái chế và thu gom rác tại bờ biển.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      3,
      'Rừng nhiệt đới giữ vai trò "lá phổi xanh" của Trái Đất, hấp thụ CO₂ và duy trì đa dạng sinh học. Mất rừng làm tăng khí nhà kính và xói mòn đất. Bảo tồn rừng cần sự phối hợp giữa cộng đồng địa phương, chính phủ và tổ chức quốc tế.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      4,
      'Đạp xe đi làm giúp giảm ùn tắc và cải thiện sức khỏe tim mạch. Thành phố có làn xe riêng khuyến khích người dân chọn phương tiện xanh. Tuy nhiên, an toàn giao thông và hạ tầng phù hợp vẫn là rào cản ở nhiều khu vực.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      5,
      'Thiền chánh niệm 10 phút mỗi ngày có thể cải thiện khả năng tập trung và giảm căng thẳng. Não bộ cần thời gian luyện tập để duy trì sự chú ý bền vững, đặc biệt khi làm việc với màn hình liên tục.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      6,
      'Uống đủ nước hỗ trợ não hoạt động hiệu quả. Thiếu nước nhẹ có thể gây mệt mỏi, giảm tập trung và trí nhớ làm việc kém hơn. Người trưởng thành nên duy trì thói quen uống nước đều trong ngày.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      7,
      'Detox số — tạm rời khỏi mạng xã hội vài giờ — giúp não nghỉ khỏi kích thích liên tục. Nhiều người báo cáo ngủ ngon hơn và ít phân tâm hơn sau khi giảm thời gian lướt feed.',
      'Kể lại nội dung theo thứ tự logic.',
      25
    ),
    (
      8,
      'Đọc sách giấy 20 phút trước khi ngủ có thể cải thiện chất lượng giấc ngủ so với dùng điện thoại. Ánh sáng xanh từ màn hình ức chế melatonin — hormone điều hòa giấc ngủ.',
      'Kể lại nội dung theo thứ tự logic.',
      30
    )
) as v(sort_order, content, hint, points_reward)
where c.slug = 'focus-noise'
  and not exists (
    select 1 from public.lessons l
    where l.category_id = c.id and l.sort_order = v.sort_order
  );

-- Ghi nhớ bền vững — 8 cấp (đọc + chờ củng cố + nhớ lại, mỗi cấp một chủ đề)
insert into public.lessons (category_id, title, summary, content, hint, sort_order, is_locked, unlock_min_points, points_reward)
select
  c.id,
  'Cấp độ ' || v.sort_order,
  'Củng cố trí nhớ dài hạn qua khoảng nghỉ.',
  v.content,
  v.hint,
  v.sort_order,
  false,
  0,
  v.points_reward
from public.categories c
cross join (
  values
    (
      1,
      'Giấc ngủ đóng vai trò quan trọng trong việc củng cố trí nhớ. Trong khi ngủ, não bộ xử lý và sắp xếp lại thông tin đã học trong ngày, chuyển chúng từ trí nhớ ngắn hạn sang trí nhớ dài hạn. Nghiên cứu cho thấy ngủ đủ 7–9 tiếng mỗi đêm giúp cải thiện khả năng ghi nhớ, học tập và giải quyết vấn đề. Thiếu ngủ không chỉ làm giảm sự tập trung mà còn ảnh hưởng đến khả năng ghi nhớ lâu dài.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      2,
      'Ôn tập cách quãng (spaced repetition) giúp thông tin bám lâu hơn trong trí nhớ dài hạn. Thay vì học dồn một lần, bạn ôn lại sau vài giờ, vài ngày rồi vài tuần. Mỗi lần ôn đúng lúc, não củng cố đường dẫn trí nhớ hiệu quả hơn.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      3,
      'Vận động thể chất đều đặn tăng lưu thông máu lên não, hỗ trợ hình thành trí nhớ mới. Đi bộ nhanh 30 phút mỗi ngày có thể cải thiện khả năng ghi nhớ và giảm suy giảm nhận thức theo thời gian.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      4,
      'Sơ đồ tư duy (mind map) giúp liên kết khái niệm bằng hình ảnh và nhánh ý. Khi não thấy cấu trúc trực quan, việc ghi nhớ và gọi lại thông tin trở nên dễ hơn so với liệt kê chữ thuần.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      5,
      'Dạy lại người khác (kỹ thuật Feynman) buộc bạn tổ chức kiến thức bằng ngôn ngữ đơn giản. Nếu giải thích được, nghĩa là bạn đã hiểu sâu và ghi nhớ bền hơn.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      6,
      'Omega-3 từ cá béo và hạt lanh hỗ trợ sức khỏe não và khả năng ghi nhớ. Chế độ ăn cân bằng, giàu rau xanh và protein nạc cũng cung cấp dưỡng chất cho hoạt động nhận thức.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      7,
      'Căng thẳng kéo dài làm tăng cortisol, ảnh hưởng vùng não liên quan đến trí nhớ. Thư giãn, thở sâu và ngủ đủ giúp giảm stress và bảo vệ khả năng ghi nhớ.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      25
    ),
    (
      8,
      'Kiên trì luyện tập mỗi ngày — dù chỉ 10 phút — hiệu quả hơn học dồn một lần. Trí nhớ bền vững được xây bằng thói quen lặp lại đều đặn theo thời gian.',
      'Hãy viết lại những gì bạn nhớ về đoạn văn.',
      30
    )
) as v(sort_order, content, hint, points_reward)
where c.slug = 'sustainable-memory'
  and not exists (
    select 1 from public.lessons l
    where l.category_id = c.id and l.sort_order = v.sort_order
  );
