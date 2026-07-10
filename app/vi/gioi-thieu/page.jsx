import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Giới thiệu',
  description: 'Về Calcroo — bộ công cụ tính thuế, lương và giấy tờ miễn phí cho người ở Úc.',
  alternates: { canonical: '/vi/gioi-thieu/', languages: { en: '/about/', vi: '/vi/gioi-thieu/' } },
};

export default function Page() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/about/" langLabel="English" />
      <main className="wrap legal">
        <h1>Về Calcroo</h1>
        <p>Calcroo xây các công cụ miễn phí cho những câu hỏi về tiền bạc và giấy tờ mà người ở Úc thật sự gặp: bộ máy tính thuế và lương cập nhật ngay ngày đầu mỗi năm tài chính, và bộ tiện ích giấy tờ — ảnh visa, nén tài liệu, PDF — cho các hồ sơ đi kèm.</p>
        <h2>Cách chúng tôi làm</h2>
        <ul>
          <li><strong>Client-side từ thiết kế:</strong> mọi phép tính chạy trong trình duyệt của bạn, và các công cụ giấy tờ cũng vậy — ảnh và tài liệu bạn xử lý không bao giờ rời khỏi thiết bị. Chúng tôi không có server nào lưu chúng.</li>
          <li><strong>Nguồn kiểm chứng được:</strong> thuế suất và các ngưỡng dựa trên số liệu công bố của Sở Thuế Úc (ato.gov.au), được đối chiếu với nguồn chính thức trước mỗi năm tài chính.</li>
          <li><strong>Trả lời thẳng:</strong> chúng tôi hiển thị đầy đủ từng khoản — thuế, Medicare levy, HECS-HELP — không phải một con số bí ẩn.</li>
        </ul>
        <h2>Chúng tôi không phải là</h2>
        <p>Calcroo là công cụ thông tin, không phải cố vấn tài chính, tax agent hay tổ chức tín dụng. Kết quả chỉ là ước tính tham khảo. Với tình huống cá nhân, hãy trao đổi với tax agent có đăng ký hoặc cố vấn có giấy phép.</p>
        <p>Có câu hỏi hoặc phát hiện sai sót? Ghé <a href="/vi/lien-he/">trang liên hệ</a>.</p>
      </main>
      <SiteFooter vi />
    </>
  );
}
