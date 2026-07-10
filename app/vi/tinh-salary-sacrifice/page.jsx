import SalarySacrificeCalculator from '../../../components/SalarySacrificeCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tính Salary Sacrifice 2026–27 — Tiết Kiệm Thuế & Cái Bẫy HECS',
  description:
    'Công cụ tính salary sacrifice vào super 2026–27: tiết kiệm bao nhiêu thuế, thực vào super bao nhiêu sau thuế 15%, concessional cap — và tác động lên HECS mà đa số công cụ bỏ qua.',
  alternates: {
    canonical: '/vi/tinh-salary-sacrifice/',
    languages: {
      en: '/salary-sacrifice-calculator/',
      vi: '/vi/tinh-salary-sacrifice/',
    },
  },
};

const FAQ = [
  {
    q: 'Salary sacrifice là gì?',
    a: 'Là thỏa thuận với chủ lao động để chuyển một phần lương vào quỹ super TRƯỚC khi tính thuế thu nhập. Phần này không chịu thuế suất biên của bạn (30–45% cộng Medicare levy) mà chỉ chịu 15% thuế đóng góp trong quỹ — chênh lệch giữa hai mức chính là phần tiết kiệm.',
  },
  {
    q: 'Sacrifice $10.000 từ lương $100.000 thì lợi bao nhiêu?',
    a: 'Thuế + Medicare giảm $3.200; quỹ thu 15% ($1.500); còn $8.500 thực vào super trong khi thực nhận chỉ giảm $6.800. Nói cách khác: mỗi $1 vào super chỉ tốn 80 cent tiền tiêu — phần chênh là tiền thuế lẽ ra phải nộp.',
  },
  {
    q: 'Salary sacrifice có giảm được khoản trả HECS không?',
    a: 'KHÔNG — đây là cái bẫy lớn nhất. HECS tính trên repayment income = thu nhập chịu thuế CỘNG NGƯỢC khoản super sacrifice. Sacrifice $10.000 từ lương $100.000 thì HECS vẫn tính trên $100.000 (khoảng $4.571), không phải trên $90.000 ($3.071). Tệ hơn: chủ lao động trừ HECS qua lương theo con số đã giảm, nên cuối năm dễ nhận hóa đơn truy thu ~$1.500.',
  },
  {
    q: 'Concessional cap là gì, vượt thì sao?',
    a: 'Là trần đóng góp trước thuế mỗi năm, tính GỘP cả 12% chủ lao động đóng lẫn phần bạn sacrifice. Vượt trần thì phần vượt bị đánh thuế theo thuế suất biên — mất sạch lợi ích. Ví dụ lương $150.000: chủ đã đóng $18.000, bạn chỉ còn dư địa $12.000 với trần $30.000. Công cụ phía trên tự kiểm tra và cảnh báo.',
  },
  {
    q: 'Thu nhập thấp có nên salary sacrifice không?',
    a: 'Thường không đáng. Lợi ích = thuế suất biên trừ 15%: ở bậc 30% bạn lời ~17 cent mỗi đô-la, nhưng ở bậc 15% gần như hòa, và dưới ngưỡng miễn thuế thì lỗ. Thu nhập thấp thường lợi hơn với đóng góp sau thuế + government co-contribution (chính phủ đóng đối ứng đến $500).',
  },
  {
    q: 'Tiền sacrifice có rút ra được không?',
    a: 'Không — tiền vào super bị khóa đến tuổi preservation (thường 60). Đây là đánh đổi lớn nhất: tiết kiệm thuế đổi lấy mất thanh khoản vài chục năm. Đừng sacrifice số tiền bạn có thể cần cho mua nhà, về Việt Nam dài hạn hay dự phòng khẩn cấp.',
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
      <SiteHeader homeHref="/vi/" langHref="/salary-sacrifice-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật năm tài chính 2026–27</div>
          <h1>Tính Salary Sacrifice 2026–27</h1>
          <p>
            Nhìn rõ bài toán đánh đổi: tiết kiệm bao nhiêu thuế, thực vào super bao nhiêu sau thuế 15%, còn dư địa cap
            không — và tác động lên HECS mà đa số công cụ lờ đi.
          </p>
        </section>

        <SalarySacrificeCalculator lang="vi" />

        <article className="content">
          <h2>Salary sacrifice vận hành thế nào?</h2>
          <p>
            Bạn thỏa thuận với chủ lao động chuyển một phần lương vào super <em>trước thuế</em>. Phần đó né được thuế
            suất biên (30–45% + Medicare levy 2%) và chỉ chịu <strong>15% trong quỹ</strong>. Khoảng chênh giữa hai
            mức là tiền bạn giữ lại được — vì vậy chiến lược này mạnh ở bậc thuế 30% trở lên và yếu dần ở thu nhập
            thấp.
          </p>

          <div className="example">
            <strong>Lương $100.000, sacrifice $10.000</strong> — thuế + Medicare giảm $3.200, quỹ thu $1.500, còn{' '}
            <strong>$8.500 vào super</strong> trong khi thực nhận chỉ giảm <strong>$6.800</strong>. Mỗi $1 vào super
            tốn 80 cent.
          </div>
          <div className="example">
            <strong>Lương $80.000, sacrifice $5.000</strong> — thực nhận giảm $3.400, super nhận $4.250. Cùng tỷ lệ
            80c/$1 vì cả hai mức lương đều nằm bậc 30%.
          </div>

          <h2>Cái bẫy HECS — lý do công cụ này tồn tại</h2>
          <p>
            HECS tính trên <strong>repayment income</strong>: thu nhập chịu thuế <em>cộng ngược</em> khoản super
            sacrifice. Sacrifice $10.000 từ lương $100.000 → HECS vẫn tính trên $100.000, tức{' '}
            <strong>$4.571</strong> năm 2026–27 — không phải $3.071 như phép tính ngây thơ trên $90.000. Chênh{' '}
            <strong>$1.500</strong>, và các calculator của quỹ super hầu hết bỏ qua chi tiết này.
          </p>
          <p>
            Đòn thứ hai kín hơn: chủ lao động trừ HECS qua lương dựa trên con số lương <em>đã giảm</em>, nên trong năm
            trừ thiếu — thiếu bao nhiêu, hóa đơn quyết toán cuối năm đòi bấy nhiêu. Nếu vừa sacrifice vừa có HECS: nhờ
            payroll trừ thêm, hoặc tự để dành khoản chênh.
          </p>

          <h2>Concessional cap: đừng để lợi thành hại</h2>
          <p>
            Trần đóng trước thuế tính gộp <strong>12% chủ đóng + phần bạn sacrifice</strong>. Vượt trần, phần vượt chịu
            thuế suất biên — công cốc. Lương càng cao, dư địa càng hẹp: $150.000 lương thì chủ đã đóng $18.000, bạn chỉ
            còn $12.000 trước trần $30.000. Nếu số dư super dưới $500.000, phần cap chưa dùng 5 năm trước có thể cộng
            dồn (carry-forward) — cách hợp lệ để đóng nhiều hơn trong một năm.
          </p>

          <h2>Khi nào nên — và không nên</h2>
          <ul>
            <li><strong>Rất đáng:</strong> bậc thuế 37–45%, tiền nhàn rỗi dài hạn, còn dư địa cap.</li>
            <li><strong>Đáng:</strong> bậc 30% — lời 17 cent mỗi đô-la, cộng dồn vài chục năm.</li>
            <li><strong>Không đáng:</strong> thu nhập chủ yếu ở bậc 15% trở xuống — lợi ích gần bằng 0; xem xét co-contribution thay thế.</li>
            <li><strong>Cân nhắc kỹ:</strong> tiền bị khóa đến ~60 tuổi — người có kế hoạch mua nhà sớm, về Việt Nam định cư, hay cần dự phòng lớn nên tính đường thanh khoản trước.</li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Xem tác động lên cả payslip trong <Link href="/vi/tinh-thue-thu-nhap-uc/">Tính Thuế Thu Nhập</Link>, hoặc
            kiểm tra khoản trả nợ trong <Link href="/vi/tinh-tra-no-hecs/">Tính Trả Nợ HECS</Link>.
          </p>

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính tham khảo — không phải tư vấn tài chính, thuế hay pháp lý; chiến lược super
            phụ thuộc lớn vào hoàn cảnh cá nhân. Trần, thuế suất, ngưỡng: xác nhận tại{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a>. Cân nhắc gặp cố vấn tài chính có giấy phép
            trước khi thay đổi khoản đóng góp.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
