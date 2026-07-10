import CasualPayCalculator from '../../../components/CasualPayCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tính Lương Casual Ở Úc 2026–27 — Loading, Penalty Rates, Thực Nhận',
  description:
    'Công cụ tính lương casual ở Úc 2026–27: giờ penalty cuối tuần và ngày lễ, số tuần làm thực tế, casual loading — và số tiền thực nhận sau thuế. Dành cho du học sinh và người Việt làm casual.',
  alternates: {
    canonical: '/vi/tinh-luong-casual/',
    languages: {
      en: '/casual-pay-calculator/',
      vi: '/vi/tinh-luong-casual/',
    },
  },
};

const FAQ = [
  {
    q: 'Casual loading là gì?',
    a: 'Là khoản cộng thêm — thường 25% theo đa số award — vào lương giờ cơ bản để bù cho những quyền lợi casual không có: phép năm có lương, nghỉ ốm có lương, thông báo trước khi cho nghỉ, trợ cấp thôi việc. Vì vậy $32/giờ casual chỉ tương đương khoảng $25,60/giờ của nhân viên chính thức.',
  },
  {
    q: 'Làm casual đóng thuế có khác nhân viên chính thức không?',
    a: 'Không — cùng một biểu thuế, không có "thuế casual" riêng. Nếu tuần nào làm nhiều thấy bị trừ thuế đậm, đó là do bảng khấu trừ tính tuần đó như thể cả năm bạn đều kiếm vậy; phần trừ dư sẽ được hoàn khi khai thuế cuối năm.',
  },
  {
    q: 'Du học sinh được làm bao nhiêu giờ?',
    a: 'Visa du học (subclass 500) hiện giới hạn 48 giờ mỗi 2 tuần trong kỳ học, không giới hạn trong kỳ nghỉ chính thức. Vượt giới hạn là vi phạm điều kiện visa — rủi ro lớn hơn nhiều so với khoản tiền kiếm thêm. Kiểm tra điều kiện hiện hành trên immi.homeaffairs.gov.au vì quy định có thể thay đổi.',
  },
  {
    q: 'Penalty rate cuối tuần và ngày lễ là bao nhiêu?',
    a: 'Tùy award của ngành bạn làm. Tham khảo phổ biến ở hospitality/retail: thứ Bảy ~1.5×, Chủ nhật ~1.75×, ngày lễ ~2.5×. Con số chính xác phải tra theo award và bậc phân loại của bạn trên fairwork.gov.au — công cụ phía trên cho phép tự chỉnh hệ số.',
  },
  {
    q: 'Làm casual có được super không?',
    a: 'Có — chủ lao động bắt buộc đóng superannuation guarantee (12% năm 2026–27) trên thu nhập giờ thường của bạn, bất kể làm ít giờ đến đâu. Kiểm tra payslip và tài khoản quỹ super định kỳ; quịt super là vi phạm phổ biến nhất với lao động casual.',
  },
  {
    q: 'Nhận lương tiền mặt thấp hơn mức tối thiểu có sao không?',
    a: 'Trả dưới mức award là bất hợp pháp, kể cả trả tiền mặt và kể cả bạn đồng ý. Nhận cash không khai còn thiệt cho chính bạn: mất bằng chứng thu nhập khi vay ngân hàng hay xin visa, không có super, không được bảo vệ khi tai nạn lao động. Tra mức tối thiểu ngành mình tại fairwork.gov.au (có hỗ trợ tiếng Việt) — khiếu nại lên Fair Work không ảnh hưởng visa của bạn.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/casual-pay-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật năm tài chính 2026–27</div>
          <h1>Tính Lương Casual Ở Úc 2026–27</h1>
          <p>
            Tính đúng kiểu casual: giờ penalty cuối tuần và ngày lễ, số tuần làm thật (không phải 52), casual loading —
            và số tiền thực vào tài khoản sau thuế.
          </p>
        </section>

        <CasualPayCalculator lang="vi" />

        <article className="content">
          <h2>Vì sao lương casual cần công cụ riêng?</h2>
          <p>
            Các công cụ tính lương thông thường giả định tuần 38 giờ đều đặn, 52 tuần có lương và một mức lương phẳng.
            Việc casual phá vỡ cả ba: lương giờ đã gộp <strong>loading 25%</strong>, phần thu nhập ngon nhất đến từ{' '}
            <strong>giờ penalty</strong> cuối tuần và ngày lễ, và <strong>nghỉ tuần nào mất lương tuần đó</strong>. Bỏ
            qua một trong ba yếu tố là ước tính năm lệch vài nghìn đô — đủ hỏng kế hoạch thuê nhà hay hồ sơ vay.
          </p>

          <h2>Ví dụ sát thực tế</h2>
          <div className="example">
            <strong>Lịch du học sinh: $32/giờ, 20 giờ thường + 8 giờ Chủ nhật (×1.75), làm 48 tuần</strong> — mỗi tuần
            $1.088, cả năm $52.224. Sau thuế $5.971 và Medicare levy $1.044, thực nhận khoảng{' '}
            <strong>$45.209</strong> — chừng $942 mỗi tuần làm. Để ý: 8 giờ Chủ nhật đóng góp tới $448 trong tuần —
            giờ penalty đáng giá gấp rưỡi gấp đôi công sức.
          </div>
          <div className="example">
            <strong>Casual full-time: $35/giờ, 38 giờ, 46 tuần</strong> (trừ các tuần vắng ca, về Việt Nam) — $61.180
            trước thuế, thực nhận khoảng <strong>$51.165</strong>. Cùng mức lương mà nhân 52 tuần sẽ ra $69.160 — dư
            tới $8.000 so với thực tế.
          </div>

          <h2>Ba điều người làm casual hay thiệt</h2>
          <ul>
            <li>
              <strong>Không kiểm tra award:</strong> mỗi ngành có mức lương tối thiểu và penalty riêng theo bậc. Trả
              dưới award là bất hợp pháp kể cả trả cash — tra tại fairwork.gov.au, có tài liệu tiếng Việt, và khiếu
              nại không ảnh hưởng visa.
            </li>
            <li>
              <strong>Bị quịt super:</strong> casual vẫn được super 12% dù làm ít giờ. Vài tháng mở app quỹ super
              kiểm tra một lần — đây là kiểu vi phạm âm thầm phổ biến nhất.
            </li>
            <li>
              <strong>Khai tax-free threshold ở cả hai job:</strong> làm 2 chỗ chỉ được khai ngưỡng miễn thuế ở một
              nơi, không thì cuối năm nhận hóa đơn nợ thuế bất ngờ.
            </li>
          </ul>

          <h2>Riêng cho du học sinh</h2>
          <p>
            Visa 500 giới hạn <strong>48 giờ mỗi 2 tuần trong kỳ học</strong> (kỳ nghỉ chính thức làm không giới hạn).
            Công cụ phía trên hữu ích để lập kế hoạch: ví dụ 24 giờ/tuần đều đặn quanh năm, hoặc 20 giờ trong kỳ +
            full-time 3 tháng hè — nhập số tuần và giờ tương ứng để so hai kịch bản. Và nhớ: thu nhập khai đủ qua TFN
            chính là bằng chứng tài chính đẹp cho hồ sơ visa, vay mua xe, thuê nhà sau này.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Đang cân nhắc giữa offer casual và việc chính thức có lương năm? So sánh bằng{' '}
            <Link href="/vi/tinh-luong-uc/">công cụ Tính Lương</Link>, và xem chi tiết thuế trong{' '}
            <Link href="/vi/tinh-thue-thu-nhap-uc/">Tính Thuế Thu Nhập</Link>.
          </p>

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính tham khảo — không phải tư vấn tài chính, thuế hay pháp lý. Penalty rate và
            lương tối thiểu phụ thuộc award, thỏa thuận và bậc phân loại của bạn: xác nhận tại fairwork.gov.au. Điều
            kiện visa kiểm tra tại immi.homeaffairs.gov.au. Số liệu thuế theo{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a>, giả định resident khai tax-free threshold
            tại một việc làm.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
