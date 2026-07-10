import { SiteHeader, SiteFooter } from '../../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Làm 2 Job Ở Úc: Thuế Tính Sao? — Giải Oan “Job 2 Bị Đánh Thuế Cao”',
  description:
    'Job thứ hai ở Úc có bị đánh thuế cao hơn không? Không — nhưng cách trừ thuế qua lương khác, và ngưỡng miễn thuế cùng HECS tạo ra bẫy thật. Ví dụ tính sẵn theo biểu 2026–27.',
  alternates: {
    canonical: '/vi/huong-dan/lam-2-job-thue/',
    languages: { en: '/guides/second-job-tax/', vi: '/vi/huong-dan/lam-2-job-thue/' },
  },
};

const FAQ = [
  {
    q: 'Job thứ hai có bị đánh thuế cao hơn không?',
    a: 'Không. ATO tính thuế trên TỔNG thu nhập cả năm qua cùng một biểu, bất kể tiền đến từ mấy chỗ. Điều có thật: tiền job 2 chồng lên trên tiền job 1, nên bị tính ở thuế suất biên (thường 30%+) thay vì được hưởng ngưỡng miễn thuế lần nữa — và payslip job 2 trông bị trừ nặng vì không tick threshold ở đó.',
  },
  {
    q: 'Sao job 2 trừ thuế nhiều vậy?',
    a: 'Vì bạn (đúng bài) không claim ngưỡng miễn thuế ở đó, nên bảng trừ của nó tính thuế từ đồng đầu tiên. Cách này thường trừ hơi DƯ — phần dư quay về bạn dưới dạng tiền hoàn khi khai thuế. Khó chịu trong năm, nhưng là hướng sai an toàn.',
  },
  {
    q: 'Lỡ tick threshold ở cả hai job thì sao?',
    a: 'Cả hai chỗ đều trừ như thể mình là job duy nhất → tổng trừ thiếu so với thuế thật → phần thiếu thành hóa đơn kèm notice of assessment. Sửa từ giờ: nộp withholding declaration bỏ tick ở job phụ. Hóa đơn lớn thì ATO có payment plan.',
  },
  {
    q: 'HECS với 2 job thì tính sao?',
    a: 'Đây là bẫy kín nhất: chỗ làm chỉ trừ HECS khi lương TẠI CHỖ ĐÓ vượt ngưỡng. Hai job mỗi job dưới $69.528 (2026–27) → không ai trừ đồng nào — nhưng ATO tính khoản trả trên TỔNG. $45.000 + $30.000 = $75.000 → hóa đơn HECS ~$820 mà không payslip nào báo trước. Nhờ job chính trừ thêm, hoặc tự để dành.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/guides/second-job-tax/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Hướng dẫn · 2026–27</div>
          <h1>Làm 2 Job: Giải Oan Chuyện &quot;Bị Đánh Thuế Cao&quot;</h1>
          <p>
            &quot;Đừng nhận job hai, thuế ăn hết&quot; — nửa hoang đường, nửa hiểu nhầm. Đây là chuyện thật sự xảy ra
            với tiền thuế khi bạn có chỗ làm thứ hai.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>Xóa sổ lời đồn</h2>
          <p>
            Không tồn tại &quot;thuế suất job hai&quot;. ATO tính thuế trên <strong>tổng thu nhập cả năm</strong> qua
            cùng một biểu, dù tiền đến từ một hay năm nơi. Nhầm lẫn đến từ hai hiệu ứng có thật: tiền job 2{' '}
            <em>chồng lên trên</em> tiền job 1 (nên bị tính ở thuế suất biên chứ không được bắt đầu từ 0), và payslip
            job 2 bị trừ trông nặng tay vì — đúng bài — không claim ngưỡng miễn thuế ở đó.
          </p>

          <div className="example">
            <strong>Ví dụ tính sẵn (2026–27):</strong> job 1 lương $50.000, job 2 thêm $20.000 — tổng $70.000. Thuế +
            Medicare: khoảng <strong>$12.920</strong>. Nếu chỉ có $50.000 thì là $6.270 — tức $20.000 của job 2 gánh
            ~$6.650, trung bình <strong>33 cent mỗi đô-la</strong>. Không phải vì job 2 &quot;bị đánh cao hơn&quot; —
            mà vì số tiền đó nằm ở bậc 30% cộng Medicare thay vì khởi động từ 0. Tự ráp tổ hợp của bạn trong{' '}
            <Link href="/vi/tinh-luong-uc/">Tính Lương</Link>.
          </div>

          <h2>Ngưỡng miễn thuế đặt ở đâu</h2>
          <p>
            Tick threshold ở <strong>job chính, chỉ một nơi</strong>. Job phụ trừ không threshold — thường trừ hơi dư
            và quay về dưới dạng tiền hoàn. Sai lầm đắt tiền thật sự là tick hai nơi: tổng trừ thiếu, phần chênh thành
            hóa đơn. Chi tiết trong <Link href="/vi/huong-dan/nguong-mien-thue/">bài ngưỡng miễn thuế</Link>.
          </p>

          <h2>Bẫy HECS hai job</h2>
          <p>
            Chỗ làm chỉ trừ HECS khi lương <em>tại chỗ đó</em> vượt ngưỡng ($69.528 năm 2026–27). Hai job mỗi job dưới
            ngưỡng → <strong>không ai trừ gì</strong> → nhưng ATO quyết toán trên tổng. $45.000 + $30.000 = $75.000
            repayment income ≈ hóa đơn <strong>~$820</strong> mà không payslip nào từng nhắc. Đúng trường hợp bạn?
            Nhờ job chính trừ thêm, hoặc để dành sẵn — <Link href="/vi/tinh-tra-no-hecs/">Tính Trả Nợ HECS</Link> cho
            biết con số chính xác.
          </p>

          <h2>Cuối năm mọi thứ tự cân</h2>
          <p>
            Income statement từ mọi job tự đổ về myGov và bạn khai <strong>một</strong> return duy nhất gộp hết. Trừ
            qua lương chỉ là ước tính chạy dọc năm — return mới là nơi chốt sổ. Ước tính trước bằng{' '}
            <Link href="/vi/tinh-hoan-thue-uc/">Tính Hoàn Thuế</Link> (bảng thu nhập có sẵn dòng job thứ hai).
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            Thông tin chung theo biểu resident 2026–27 đã công bố — không phải tư vấn thuế. Xác nhận trường hợp của
            bạn tại <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> hoặc với tax agent có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
