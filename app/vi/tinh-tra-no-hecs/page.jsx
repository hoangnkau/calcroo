import HecsCalculator from '../../../components/HecsCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tính Trả Nợ HECS 2026–27 — Bao Lâu Trả Hết, Có Nên Trả Sớm?',
  description:
    'Công cụ tính trả nợ HECS-HELP 2026–27: khoản trả bắt buộc theo cách tính lũy tiến mới, mất bao nhiêu năm trả hết nợ với indexation, và trả thêm tự nguyện tiết kiệm được bao nhiêu.',
  alternates: {
    canonical: '/vi/tinh-tra-no-hecs/',
    languages: {
      en: '/hecs-repayment-calculator/',
      vi: '/vi/tinh-tra-no-hecs/',
    },
  },
};

const FAQ = [
  {
    q: 'HECS-HELP là gì?',
    a: 'Là khoản vay học phí của chính phủ Úc cho sinh viên học ghế Commonwealth supported (CSP) — chỉ dành cho công dân Úc, một số thường trú nhân và người giữ visa nhân đạo. Nợ không tính lãi nhưng được index hàng năm, và trả dần qua hệ thống thuế khi thu nhập vượt ngưỡng.',
  },
  {
    q: 'Du học sinh có được vay HECS không?',
    a: 'Không. Du học sinh (international students) đóng học phí trực tiếp, không thuộc diện HECS-HELP. Tuy nhiên nếu sau này bạn có PR/quốc tịch rồi học tiếp, một số khóa cho phép vay FEE-HELP hoặc học ghế CSP — khi đó các quy tắc trả nợ trong trang này áp dụng cho bạn.',
  },
  {
    q: 'Lương $100.000 thì mỗi năm trả HECS bao nhiêu?',
    a: 'Năm 2026–27: trả 15 cent cho mỗi đô-la vượt ngưỡng $69.528, tức ($100.000 − $69.528) × 15% ≈ $4.571/năm — khoảng $176 mỗi 2 tuần trừ qua lương.',
  },
  {
    q: 'Nợ HECS có lãi suất không?',
    a: 'Không có lãi, nhưng dư nợ được index mỗi ngày 1/6 theo mức thấp hơn giữa CPI và chỉ số tăng lương (WPI). Indexation áp lên dư nợ TRƯỚC khi khoản trả bắt buộc của năm đó được ghi có — đây là lý do trả sớm tiết kiệm được tiền.',
  },
  {
    q: 'Có nên trả hết HECS sớm không?',
    a: 'Là bài toán đánh đổi. Trả sớm né được indexation tương lai (coi như "lợi nhuận" chắc chắn bằng đúng mức index), nhưng tiền đã trả không rút lại được — trong khi HECS là khoản nợ linh hoạt nhất bạn từng có: thu nhập thấp thì tự động không phải trả. So sánh với lãi vay nhà, offset account và các mục tiêu khác trước khi quyết định; cần tư vấn cá nhân hãy hỏi chuyên gia có giấy phép.',
  },
  {
    q: 'Salary sacrifice có làm tăng khoản trả HECS không?',
    a: 'Có — điểm nhiều người bất ngờ. Khoản trả tính trên repayment income, gồm thu nhập chịu thuế CỘNG NGƯỢC super đóng qua salary sacrifice, fringe benefits, lỗ đầu tư ròng. Salary sacrifice giảm thuế thu nhập nhưng không giảm (thậm chí giữ nguyên) khoản trả HECS.',
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
      <SiteHeader homeHref="/vi/" langHref="/hecs-repayment-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật 2026–27 · cách tính lũy tiến</div>
          <h1>Tính Trả Nợ HECS 2026–27</h1>
          <p>
            Xem khoản trả bắt buộc theo cách tính mới, mất bao nhiêu năm để trả hết nợ khi tính cả indexation — và trả
            thêm tự nguyện rút ngắn được mấy năm.
          </p>
        </section>

        <HecsCalculator lang="vi" />

        <article className="content">
          <h2>Cách trả nợ HECS năm 2026–27</h2>
          <p>
            Khoản trả bắt buộc giờ tính như bậc thuế: thu nhập (repayment income) đến <strong>$69.528</strong> chưa
            phải trả; phần vượt trả <strong>15 cent mỗi đô-la</strong> đến $129.717; tiếp theo{' '}
            <strong>$9.028 cộng 17 cent mỗi đô-la</strong> đến $186.050; trên mức đó chuyển sang{' '}
            <strong>10% phẳng trên toàn bộ repayment income</strong>. Ngưỡng được điều chỉnh hàng năm theo mức tăng
            lương trung bình.
          </p>
          <p>
            Chủ lao động trừ dần qua từng kỳ lương (vì vậy khi điền TFN declaration phải khai có nợ học phí), nhưng con
            số chính thức chỉ chốt khi bạn khai thuế — và được ghi có vào khoản nợ <em>sau</em> khi indexation đã áp
            ngày 1/6.
          </p>

          <h2>Indexation — thứ âm thầm nuôi khoản nợ</h2>
          <p>
            HECS không tính lãi, nhưng mỗi ngày 1/6 dư nợ được nhân theo mức thấp hơn giữa CPI và chỉ số tăng lương.
            Trình tự này quan trọng: index áp lên dư nợ <em>trước</em> khi khoản trả trong năm được trừ vào. Nợ
            $50.000 gặp index 3% là cộng thêm $1.500 chỉ trong một ngày. Công cụ phía trên mô phỏng từng năm theo đúng
            trình tự đó — nên timeline thật thường dài hơn phép chia đơn giản &quot;nợ ÷ khoản trả&quot;.
          </p>

          <h2>Vài kịch bản thực tế</h2>
          <div className="example">
            <strong>Nợ $30.000, lương $85.000</strong> — khoản trả bắt đầu ~$2.321/năm. Với index 3% và lương tăng
            3%/năm, trả hết trong khoảng <strong>9 năm</strong>, cộng dồn ~$5.400 indexation.
          </div>
          <div className="example">
            <strong>Cùng kịch bản, trả thêm $3.000/năm tự nguyện</strong> — rút xuống còn <strong>6 năm</strong>, né
            được ~$2.300 indexation. Trả thêm càng sớm càng lợi, vì nó giảm phần dư nợ bị index mỗi tháng 6.
          </div>
          <div className="example">
            <strong>Nợ $50.000, lương $75.000</strong> — khoản trả chỉ ~$821/năm, nhỉnh hơn indexation chút xíu. Mất
            khoảng <strong>18 năm</strong> và cộng dồn ~<strong>$20.300 indexation</strong>. Đây là hồ sơ mà trả thêm
            tự nguyện (hoặc tăng thu nhập) thay đổi cục diện nhiều nhất.
          </div>

          <h2>Giả định của công cụ</h2>
          <ul>
            <li>Ngưỡng trả nợ 2026–27 giữ nguyên cho các năm sau (thực tế sẽ tăng theo lương).</li>
            <li>Indexation và tăng lương theo tỷ lệ bạn nhập (mặc định 3%), áp mỗi năm một lần.</li>
            <li>Index áp trước, khoản trả ghi có sau — khớp trình tự tháng 6/tháng 7 của ATO.</li>
            <li>Repayment income lấy đúng số bạn nhập; các khoản cộng ngược (salary sacrifice...) bạn tự cộng vào.</li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Muốn xem khoản trả HECS trong bức tranh cả payslip — thuế, Medicare levy, lương thực nhận? Dùng{' '}
            <Link href="/vi/tinh-thue-thu-nhap-uc/">công cụ Tính Thuế Thu Nhập</Link> hoặc{' '}
            <Link href="/vi/tinh-luong-uc/">Tính Lương</Link>.
          </p>

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính tham khảo — không phải tư vấn tài chính, thuế hay pháp lý. Dự phóng thời gian
            trả nợ phụ thuộc giả định về indexation, tăng lương và ngưỡng không đổi — thực tế sẽ khác. Kiểm tra dư nợ
            và số liệu tại <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> / myGov, hoặc hỏi tax agent
            có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
