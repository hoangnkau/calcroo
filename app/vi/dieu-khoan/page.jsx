import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản sử dụng của Calcroo.',
  alternates: { canonical: '/vi/dieu-khoan/', languages: { en: '/terms/', vi: '/vi/dieu-khoan/' } },
};

export default function Page() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/terms/" langLabel="English" />
      <main className="wrap legal">
        <h1>Điều khoản sử dụng</h1>
        <p>Cập nhật lần cuối: tháng 7/2026</p>
        <h2>Chỉ là ước tính — không phải tư vấn</h2>
        <p>Calcroo cung cấp công cụ tính và nội dung cho mục đích thông tin chung. Kết quả là ước tính dựa trên dữ liệu bạn nhập và thuế suất công bố, không cấu thành tư vấn tài chính, thuế hay pháp lý, và không xét đến mục tiêu, hoàn cảnh tài chính hay nhu cầu của bạn. Trước khi hành động, hãy đối chiếu với Sở Thuế Úc (ato.gov.au) hoặc tham khảo tax agent có đăng ký / cố vấn tài chính có giấy phép.</p>
        <h2>Công cụ giấy tờ</h2>
        <p>Các tiện ích ảnh, tài liệu và PDF định dạng file theo quy cách phổ biến tại Úc nhằm hỗ trợ người dùng. Yêu cầu thay đổi theo thời gian và theo loại hồ sơ — luôn xác nhận quy cách hiện hành với cơ quan liên quan (như Bộ Nội vụ với ảnh visa/hộ chiếu) trước khi nộp. Chúng tôi không bảo đảm file tạo ra sẽ được bên thứ ba chấp nhận.</p>
        <h2>Độ chính xác</h2>
        <p>Chúng tôi cẩn trọng cập nhật thuế suất và các ngưỡng theo từng năm tài chính, nhưng không bảo đảm mọi thông tin luôn đầy đủ, chính xác và mới nhất tại mọi thời điểm. Luật thuế thay đổi và hoàn cảnh mỗi người mỗi khác.</p>
        <h2>Trách nhiệm</h2>
        <p>Trong phạm vi tối đa pháp luật cho phép, Calcroo loại trừ trách nhiệm với mọi tổn thất phát sinh từ việc dựa vào thông tin hoặc kết quả trên site này.</p>
        <h2>Sử dụng hợp lệ</h2>
        <p>Bạn được dùng công cụ tự do cho mục đích cá nhân và công việc. Không được scrape, đăng lại, bán lại nội dung hoặc nhúng công cụ của chúng tôi khi chưa được phép.</p>
      </main>
      <SiteFooter vi />
    </>
  );
}
