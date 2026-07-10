import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật của Calcroo.',
  alternates: { canonical: '/vi/bao-mat/', languages: { en: '/privacy/', vi: '/vi/bao-mat/' } },
};

export default function Page() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/privacy/" langLabel="English" />
      <main className="wrap legal">
        <h1>Chính sách bảo mật</h1>
        <p>Cập nhật lần cuối: tháng 7/2026</p>
        <h2>Số liệu bạn nhập</h2>
        <p>Toàn bộ công cụ tính của Calcroo chạy ngay trong trình duyệt (client-side). Thu nhập và các con số tài chính bạn gõ được xử lý trên thiết bị của bạn, không được truyền về hay lưu trên server của chúng tôi.</p>
        <h2>Ảnh và tài liệu</h2>
        <p>Các công cụ giấy tờ (chỉnh ảnh, nén tài liệu, tiện ích PDF) cũng chạy hoàn toàn trong trình duyệt. File bạn chọn được đọc và xử lý cục bộ trên thiết bị bằng API của trình duyệt, không bao giờ được upload, truyền đi hay lưu trên server của chúng tôi. Đóng trang là file bị loại bỏ.</p>
        <h2>Analytics</h2>
        <p>Chúng tôi dùng công cụ phân tích tôn trọng quyền riêng tư để hiểu mức sử dụng tổng hợp (trang được xem, vị trí gần đúng theo quốc gia/bang, loại thiết bị). Dữ liệu này không bao gồm các con số bạn nhập vào công cụ và không dùng để nhận diện cá nhân bạn.</p>
        <h2>Quảng cáo</h2>
        <p>Calcroo có thể hiển thị quảng cáo (như Google AdSense) để giữ công cụ miễn phí. Nhà cung cấp quảng cáo có thể dùng cookie để hiển thị quảng cáo phù hợp; bạn quản lý cá nhân hóa quảng cáo trong cài đặt Google hoặc tắt tại adssettings.google.com.</p>
        <h2>Cookie</h2>
        <p>Chúng tôi chỉ dùng cookie cần thiết cho hoạt động của site, analytics và (nếu có) quảng cáo. Chúng tôi không bán thông tin cá nhân.</p>
        <h2>Liên hệ</h2>
        <p>Câu hỏi về quyền riêng tư, liên hệ qua <a href="/vi/lien-he/">trang liên hệ</a>.</p>
      </main>
      <SiteFooter vi />
    </>
  );
}
