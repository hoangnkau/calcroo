import TaxCalculator from '../../../components/TaxCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Tính Thuế Thu Nhập Ở Úc 2026–27 — Lương Thực Nhận, HECS & Medicare',
  description:
    'Công cụ tính thuế thu nhập Úc miễn phí, cập nhật năm tài chính 2026–27. Xem ngay lương thực nhận, thuế thu nhập, Medicare levy và khoản trả nợ HECS-HELP — dành cho người Việt đang sống và làm việc tại Úc.',
  alternates: {
    canonical: '/vi/tinh-thue-thu-nhap-uc/',
    languages: {
      en: '/income-tax-calculator/',
      vi: '/vi/tinh-thue-thu-nhap-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Thuế thu nhập ở Úc năm 2026–27 tính như thế nào?',
    a: 'Với resident: $18.200 đầu tiên miễn thuế, từ $18.201 đến $45.000 chịu 15% (giảm từ 16% từ ngày 1/7/2026), $45.001 đến $135.000 chịu 30%, $135.001 đến $190.000 chịu 37%, và phần trên $190.000 chịu 45%. Đa số người đi làm đóng thêm Medicare levy 2%.',
  },
  {
    q: 'Lương $80.000 ở Úc thực nhận bao nhiêu?',
    a: 'Với lương $80.000/năm (chưa gồm super): thuế thu nhập khoảng $14.520, Medicare levy $1.600 — thực nhận khoảng $63.880/năm, tương đương $5.323/tháng. Nếu có nợ HECS, trừ thêm $1.571, còn khoảng $62.309/năm.',
  },
  {
    q: 'HECS là gì và trả nợ như thế nào trong 2026–27?',
    a: 'HECS-HELP là khoản vay học phí đại học của chính phủ Úc. Cách trả nợ tính theo kiểu lũy tiến — năm 2026–27: thu nhập đến $69.528 chưa phải trả, phần từ $69.529 đến $129.717 trả 15 cent mỗi đô-la, phần từ $129.718 đến $186.050 trả $9.028 cộng 17 cent mỗi đô-la vượt. Trên $186.050, khoản trả là 10% phẳng trên toàn bộ repayment income. Khoản này được trừ thẳng qua lương khi bạn khai TFN với chủ lao động.',
  },
  {
    q: 'Du học sinh và người mới sang Úc có phải đóng thuế như người bản xứ không?',
    a: 'Tùy tình trạng cư trú thuế (tax residency) — khác với tình trạng visa. Nhiều du học sinh ở Úc trên 6 tháng được xem là resident cho mục đích thuế và hưởng ngưỡng miễn thuế $18.200. Người giữ visa working holiday (417/462) chịu biểu thuế riêng, 15% ngay từ đồng đầu tiên. Công cụ này hiện tính cho resident.',
  },
  {
    q: 'TFN và ABN khác nhau thế nào khi tính thuế?',
    a: 'Làm công ăn lương dùng TFN: chủ lao động trừ thuế qua từng kỳ lương và đóng super cho bạn. Làm việc qua ABN (tự doanh, giao đồ ăn, nail...): bạn nhận đủ tiền nhưng tự chịu trách nhiệm để dành tiền đóng thuế khi khai cuối năm và tự lo super. Thu nhập ABN vẫn tính theo cùng biểu thuế resident ở trên.',
  },
  {
    q: 'Super có bị tính thuế thu nhập không?',
    a: 'Không tính vào thuế thu nhập cá nhân của bạn. Super (12% năm 2026–27) do chủ lao động đóng thêm bên ngoài lương, vào quỹ hưu trí của bạn, và bị đánh thuế riêng 15% bên trong quỹ. Khi nhập lương vào công cụ này, hãy nhập số chưa gồm super.',
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
      <SiteHeader langHref="/income-tax-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật năm tài chính 2026–27 · từ 1/7/2026</div>
          <h1>Tính Thuế Thu Nhập Ở Úc 2026–27</h1>
          <p>
            Nhập lương để xem ngay lương thực nhận, thuế thu nhập, Medicare levy và khoản trả nợ HECS-HELP theo biểu
            thuế mới — công cụ miễn phí cho người Việt đang sống và làm việc tại Úc.
          </p>
        </section>

        <TaxCalculator lang="vi" />

        <article className="content">
          <h2>Thuế thu nhập ở Úc hoạt động ra sao?</h2>
          <p>
            Úc đánh thuế theo kiểu <strong>lũy tiến từng phần</strong>: thu nhập của bạn được chia thành các bậc, mỗi
            bậc chịu một mức thuế riêng. Đây là điểm nhiều người mới sang hay hiểu nhầm — lên bậc thuế cao hơn{' '}
            <em>không</em> có nghĩa toàn bộ lương bị đánh thuế cao hơn, mà chỉ phần thu nhập nằm trong bậc đó. Vì vậy
            tăng lương không bao giờ khiến bạn &quot;lỗ&quot;.
          </p>

          <table>
            <thead>
              <tr>
                <th>Thu nhập chịu thuế (2026–27)</th>
                <th>Thuế suất</th>
                <th>Cách tính</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>$0 – $18.200</td><td>0%</td><td>Miễn thuế</td></tr>
              <tr><td>$18.201 – $45.000</td><td>15%</td><td>15c mỗi $1 vượt $18.200</td></tr>
              <tr><td>$45.001 – $135.000</td><td>30%</td><td>$4.020 + 30c mỗi $1 vượt $45.000</td></tr>
              <tr><td>$135.001 – $190.000</td><td>37%</td><td>$31.020 + 37c mỗi $1 vượt $135.000</td></tr>
              <tr><td>Trên $190.000</td><td>45%</td><td>$51.370 + 45c mỗi $1 vượt $190.000</td></tr>
            </tbody>
          </table>

          <p>
            Từ ngày <strong>1/7/2026</strong>, bậc thuế thứ hai giảm từ 16% xuống <strong>15%</strong> — ai có thu nhập
            trên $45.000 đều tiết kiệm tối đa $268/năm so với năm trước. Ngoài thuế thu nhập, đa số người đi làm đóng
            thêm <strong>Medicare levy 2%</strong> cho hệ thống y tế công. Người thu nhập thấp được giảm hoặc miễn;
            người giữ một số loại visa tạm trú không được hưởng Medicare có thể xin miễn hoàn toàn (Medicare levy
            exemption) khi khai thuế.
          </p>

          <h2>Ví dụ cụ thể theo mức lương phổ biến</h2>
          <div className="example">
            <strong>Lương $60.000</strong> (mức phổ biến cho công việc full-time đầu tiên) — thuế thu nhập $8.520,
            được giảm trừ LITO $100 còn $8.420, cộng Medicare levy $1.200. Thực nhận khoảng{' '}
            <strong>$50.380/năm</strong>, tức $4.198/tháng hoặc $969/tuần.
          </div>
          <div className="example">
            <strong>Lương $90.000</strong> — thuế $17.520, Medicare levy $1.800, thực nhận khoảng{' '}
            <strong>$70.680/năm</strong> ($5.890/tháng). Nếu có nợ HECS, trả thêm $3.071/năm, thực nhận còn $67.609.
          </div>
          <div className="example">
            <strong>Lương $150.000</strong> — thuế $36.570, Medicare levy $3.000, thực nhận khoảng{' '}
            <strong>$110.430/năm</strong>. Thuế suất biên là 37% nhưng thuế suất thực tế chỉ 26,4% — minh chứng cho
            cách tính lũy tiến từng phần.
          </div>

          <h2>HECS-HELP: cách trả nợ học phí kiểu mới</h2>
          <p>
            Nếu bạn học đại học ở Úc bằng khoản vay HECS-HELP, khoản nợ được trả dần qua hệ thống thuế. Cách tính theo kiểu lũy
            tiến giống bậc thuế — năm 2026–27: thu nhập đến <strong>$69.528</strong> chưa phải trả gì; phần vượt trả{' '}
            <strong>15 cent mỗi đô-la</strong> đến $129.717; tiếp theo là <strong>$9.028 cộng 17 cent mỗi đô-la</strong>{' '}
            đến $186.050; và trên $186.050 chuyển sang <strong>10% phẳng trên toàn bộ repayment income</strong>. Chính
            phủ cũng đã xóa một lần 20% dư nợ cho các khoản vay tồn tại ngày
            1/6/2025 — việc xóa này tự động, không cần đăng ký.
          </p>
          <p>
            Lưu ý: khoản trả HECS tính trên <em>repayment income</em> — gồm thu nhập chịu thuế cộng vài khoản cộng
            ngược như super đóng qua salary sacrifice. Nếu bạn đang salary sacrifice, khoản trả HECS thực tế có thể cao
            hơn con số ở đây.
          </p>

          <h2>Vài điều người Việt mới sang cần biết</h2>
          <ul>
            <li>
              <strong>Resident thuế ≠ thường trú nhân (PR).</strong> Bạn có thể chưa có PR nhưng vẫn là resident cho
              mục đích thuế nếu sống ở Úc đủ lâu và có nơi ở ổn định — khi đó được hưởng ngưỡng miễn thuế $18.200.
            </li>
            <li>
              <strong>Năm tài chính Úc</strong> chạy từ 1/7 đến 30/6, khai thuế (tax return) từ 1/7 đến 31/10 hàng năm
              qua myGov hoặc tax agent.
            </li>
            <li>
              <strong>Lương thỏa thuận thường là số trước thuế</strong> và có thể ghi kèm super hoặc không — khi phỏng
              vấn hãy hỏi rõ &quot;base salary&quot; hay &quot;package including super&quot;.
            </li>
            <li>
              <strong>Làm việc nhận tiền mặt không khai thuế</strong> là rủi ro lớn: mất bằng chứng thu nhập khi vay
              mua nhà, xin visa, và có thể bị ATO phạt nặng.
            </li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính mang tính tham khảo — không phải tư vấn tài chính, thuế hay pháp lý và không
            xét hoàn cảnh cá nhân của bạn. Số liệu áp dụng cho resident và chưa gồm các khoản như Medicare levy
            surcharge hay thuế Division 293. Biểu thuế dựa trên công bố của ATO cho năm 2026–27. Hãy đối chiếu với{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> hoặc hỏi tax agent có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
