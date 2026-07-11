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
    href: '/vi/gop-pdf/',
    live: true,
    name: 'Gộp PDF',
    desc: 'Gộp payslip, giấy tờ và ảnh thành một file PDF nộp hồ sơ vay, visa. File không rời máy bạn.',
  },
  {
    href: '/vi/tao-cv-uc/',
    live: true,
    name: 'Tạo CV Chuẩn Úc',
    desc: 'CV kiểu Úc thân thiện ATS — không ảnh, không ngày sinh.',
  },
  {
    href: '/vi/tach-pdf/',
    live: true,
    name: 'Tách PDF',
    desc: 'Chỉ giữ những trang cần nộp từ sao kê, bản scan — hoặc xóa trang thừa.',
  },
  {
    href: '/vi/tao-chu-ky/',
    live: true,
    name: 'Tạo Chữ Ký',
    desc: 'Vẽ chữ ký và tải PNG nền trong suốt để chèn vào form, hợp đồng.',
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
            Miễn phí, nhanh và riêng tư — mọi công cụ của Calcroo chạy ngay trên trình duyệt của bạn, từ tính thuế,
            tính lương đến chỉnh ảnh visa, gộp PDF và tạo CV. Không cần đăng ký, không tường phí, không &quot;để lại
            số điện thoại để được tư vấn&quot;. Nhập số, thấy ngay tiền của mình đi đâu.
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
        <p className="tools-sub">Tiện ích cho hồ sơ visa, vay, thủ tục — miễn phí, chạy riêng tư ngay trên trình duyệt của bạn.</p>
        <div className="tools-grid">
          {PAPERWORK.map((t) => (
            <ToolCard key={t.name} t={t} />
          ))}
        </div>

        <h2 className="tools-h">Bài hướng dẫn</h2>
        <p className="tools-sub">Giải thích dễ hiểu, đi kèm đúng công cụ — <Link href="/vi/huong-dan/">xem tất cả</Link>.</p>
        <div className="tools-grid">
          <Link href="/vi/huong-dan/khai-thue-uc-2026/" className="tool-card">
            <span className="live">Mùa thuế 2026</span>
            <h3>Hướng Dẫn Khai Thuế Úc 2026 Cho Người Mới</h3>
            <p>Mốc thời gian, 7 bước trên myTax, và năm nay có gì khác.</p>
          </Link>
          <Link href="/vi/huong-dan/nguong-mien-thue/" className="tool-card">
            <span className="live">Kiến thức nền</span>
            <h3>Ngưỡng Miễn Thuế $18.200, Nói Cho Dễ Hiểu</h3>
            <p>Tick ở job nào — và vì sao sàn không-thuế thật là ~$22.860.</p>
          </Link>
          <Link href="/vi/huong-dan/lam-2-job-thue/" className="tool-card">
            <span className="live">Làm 2 job</span>
            <h3>Làm 2 Job: Giải Oan “Bị Đánh Thuế Cao”</h3>
            <p>Job 2 không bị đánh cao hơn — nhưng bẫy threshold và HECS là thật.</p>
          </Link>
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
            việc tại Úc — từ chuyện TFN với ABN, khai thuế lần đầu, lương casual, đến bộ công cụ giấy tờ đã chạy đủ:
            chỉnh ảnh visa chuẩn 35×45mm, nén ảnh giấy tờ, gộp PDF và tạo CV chuẩn Úc. Muốn có công cụ nào tiếp theo?{' '}
            <Link href="/vi/lien-he/">Nhắn cho chúng tôi</Link>.
          </p>
        </article>
      </main>
      <SiteFooter vi />
    </>
  );
}
