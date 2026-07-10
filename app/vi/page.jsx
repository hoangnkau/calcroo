import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = {
  title: 'Calcroo — Công Cụ Tính Thuế & Lương Ở Úc Miễn Phí (2026–27)',
  description:
    'Bộ công cụ tính thuế, lương, HECS, hoàn thuế miễn phí cho người Việt tại Úc — cập nhật năm tài chính 2026–27, kèm công cụ giấy tờ cho hồ sơ visa, vay. Không cần đăng ký.',
  alternates: {
    canonical: '/vi/',
    languages: { en: '/', vi: '/vi/' },
  },
};

const FINANCE = [
  {
    href: '/vi/tinh-hoan-thue-uc/',
    live: true,
    name: 'Tính Hoàn Thuế',
    desc: 'Ước tính tax return 2025–26 trước khi khai — được hoàn hay phải đóng thêm.',
  },
  {
    href: '/vi/tinh-thue-thu-nhap-uc/',
    live: true,
    name: 'Tính Thuế Thu Nhập',
    desc: 'Lương thực nhận, thuế thu nhập, Medicare levy và HECS-HELP theo biểu thuế 2026–27.',
  },
  {
    href: '/vi/tinh-luong-uc/',
    live: true,
    name: 'Tính Lương',
    desc: 'Quy đổi lương giờ ↔ tuần ↔ tháng ↔ năm, trước và sau thuế.',
  },
  {
    href: '/vi/tinh-tra-no-hecs/',
    live: true,
    name: 'Tính Trả Nợ HECS',
    desc: 'Khoản trả bắt buộc, bao lâu trả hết nợ, và trả sớm tiết kiệm được bao nhiêu.',
  },
  {
    href: '/vi/tinh-luong-casual/',
    live: true,
    name: 'Tính Lương Casual',
    desc: 'Casual loading, penalty cuối tuần/ngày lễ và số tuần làm thực tế.',
  },
  {
    href: '/vi/tinh-salary-sacrifice/',
    live: true,
    name: 'Tính Salary Sacrifice',
    desc: 'Đóng thêm super, tiết kiệm thuế và tác động lên HECS.',
  },
];

const PAPERWORK = [
  {
    href: '/vi/chinh-anh-visa-uc/',
    live: true,
    name: 'Chỉnh Ảnh Visa',
    desc: 'Crop và resize ảnh đúng chuẩn hộ chiếu/visa Úc 35×45mm — ngay trên trình duyệt.',
  },
  {
    href: '/vi/nen-anh-giay-to/',
    live: true,
    name: 'Nén Ảnh Giấy Tờ',
    desc: 'Thu nhỏ ảnh chụp giấy tờ để vừa giới hạn upload của immi, Centrelink, ngân hàng.',
  },
  {
    name: 'Gộp & Nén PDF',
    desc: 'Gộp payslip, giấy tờ thành một file PDF nộp hồ sơ vay, visa. File không rời máy bạn.',
  },
  {
    name: 'Tạo CV Chuẩn Úc',
    desc: 'CV kiểu Úc thân thiện ATS — không ảnh, không ngày sinh.',
  },
];

function ToolCard({ t }) {
  return t.live ? (
    <Link href={t.href} className="tool-card">
      <span className="live">Đang chạy</span>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
    </Link>
  ) : (
    <div className="tool-card disabled">
      <span className="soon">Sắp ra mắt</span>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
    </div>
  );
}

export default function HomeVi() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật năm tài chính 2026–27</div>
          <h1>Công cụ tính thuế &amp; lương ở Úc, trả lời thẳng vào vấn đề</h1>
          <p>
            Miễn phí, nhanh và riêng tư — mọi công cụ của Calcroo chạy ngay trên trình duyệt của bạn. Không cần đăng
            ký, không tường phí, không &quot;để lại số điện thoại để được tư vấn&quot;. Nhập số, thấy ngay tiền của
            mình đi đâu.
          </p>
        </section>

        <h2 className="tools-h">Công cụ thuế &amp; lương</h2>
        <p className="tools-sub">Đủ 6 công cụ theo biểu thuế 2026–27 — sẵn sàng cho mùa khai thuế 2026.</p>
        <div className="tools-grid">
          {FINANCE.map((t) => (
            <ToolCard key={t.name} t={t} />
          ))}
        </div>

        <h2 className="tools-h">Công cụ giấy tờ</h2>
        <p className="tools-sub">Tiện ích cho hồ sơ visa, vay, thủ tục — chạy trên trình duyệt, đang xây dựng.</p>
        <div className="tools-grid">
          {PAPERWORK.map((t) => (
            <ToolCard key={t.name} t={t} />
          ))}
        </div>

        <article className="content">
          <h2>Vì sao có Calcroo?</h2>
          <p>
            Phần lớn công cụ tính thuế ở Úc do ngân hàng và công ty cho vay xây, với mục đích dẫn bạn đến sản phẩm của
            họ — hoặc cập nhật chậm chạp khi biểu thuế thay đổi. Calcroo đi hướng khác: cập nhật ngay ngày đầu mỗi năm
            tài chính (biểu 2026–27 chạy từ 1/7/2026), hiển thị rõ cách tính từng khoản, và số liệu bạn nhập không bao
            giờ rời khỏi thiết bị — mọi phép tính chạy ngay trên trình duyệt.
          </p>
          <p>
            Phiên bản tiếng Việt không phải bản dịch máy: nội dung viết riêng cho người Việt đang sống, học và làm
            việc tại Úc — từ chuyện TFN với ABN, khai thuế lần đầu, đến lương casual và làm hai job. Muốn có công cụ
            nào tiếp theo? <Link href="/contact/">Nhắn cho chúng tôi</Link>.
          </p>
        </article>
      </main>
      <SiteFooter vi />
    </>
  );
}
