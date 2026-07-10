import PayCalculator from '../../../components/PayCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tính Lương Ở Úc 2026–27 — Quy Đổi Lương Giờ, Tuần, Năm Sau Thuế',
  description:
    'Công cụ tính lương Úc miễn phí năm 2026–27: quy đổi lương theo giờ, tuần, 2 tuần, tháng, năm và xem số thực nhận sau thuế, Medicare levy, HECS — dành cho người Việt đang làm việc tại Úc.',
  alternates: {
    canonical: '/vi/tinh-luong-uc/',
    languages: {
      en: '/pay-calculator/',
      vi: '/vi/tinh-luong-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Lương $35/giờ ở Úc là bao nhiêu một năm, thực nhận bao nhiêu?',
    a: 'Làm full-time 38 giờ/tuần: $35 × 38 × 52 = $69.160/năm trước thuế. Năm 2026–27, thuế thu nhập khoảng $11.268 và Medicare levy $1.383 — thực nhận khoảng $56.509/năm, tức $1.087/tuần, tương đương $28,60/giờ sau thuế.',
  },
  {
    q: 'Lương $80.000/năm quy ra bao nhiêu một giờ?',
    a: 'Với tuần chuẩn 38 giờ: $80.000 ÷ 1.976 giờ ≈ $40,49/giờ trước thuế. Sau thuế $14.520 và Medicare levy $1.600, thực nhận khoảng $63.880/năm — $1.228/tuần, $2.457/2 tuần, $5.323/tháng.',
  },
  {
    q: 'Vì sao lương thực nhận trên payslip hơi khác con số ở đây?',
    a: 'Chủ lao động trừ thuế theo bảng khấu trừ (withholding tables) của ATO, làm tròn theo từng kỳ lương. Chênh lệch nhỏ sẽ được quyết toán khi khai thuế cuối năm: trừ dư thì được hoàn (tax refund), trừ thiếu thì đóng bù.',
  },
  {
    q: 'Lương casual $35/giờ có bằng lương chính thức $35/giờ không?',
    a: 'Không. Lương casual đã cộng khoản loading (thường 25%) để bù cho việc không có phép năm, nghỉ ốm có lương. $35/giờ casual tương đương khoảng $28/giờ của nhân viên chính thức khi quy đổi cả quyền lợi. Casual cũng không được trả cho tuần không làm — nhân với 52 tuần sẽ ước tính dư thu nhập thật.',
  },
  {
    q: 'Job đăng "package $88.000 including super" nghĩa là lương bao nhiêu?',
    a: 'Đó là gói đã gộp super. Với mức super 12% năm 2026–27: lương gốc = $88.000 ÷ 1,12 ≈ $78.571. Thuế tính trên lương gốc này, không tính trên cả gói. Khi thỏa thuận lương hãy hỏi rõ "base salary" hay "package".',
  },
  {
    q: 'Làm 2 job thì tính thuế thế nào?',
    a: 'Thuế cuối năm tính trên tổng thu nhập cả 2 job cộng lại theo cùng biểu thuế lũy tiến. Lưu ý chỉ khai tax-free threshold ($18.200) ở MỘT job — thường là job thu nhập cao hơn; job thứ hai sẽ bị trừ thuế cao hơn qua lương, phần dư thừa được hoàn khi khai thuế.',
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
      <SiteHeader homeHref="/vi/" langHref="/pay-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Cập nhật năm tài chính 2026–27</div>
          <h1>Tính Lương Ở Úc 2026–27</h1>
          <p>
            Quy đổi lương theo giờ ↔ tuần ↔ 2 tuần ↔ tháng ↔ năm, và xem số tiền thực nhận sau thuế, Medicare levy,
            HECS-HELP cho từng kỳ lương.
          </p>
        </section>

        <PayCalculator lang="vi" />

        <article className="content">
          <h2>Cách quy đổi các kỳ lương ở Úc</h2>
          <p>
            Ở Úc, mỗi loại việc báo lương một kiểu: việc casual và theo award tính <strong>theo giờ</strong>, việc văn
            phòng tính <strong>theo năm</strong>, còn tiền nhà lại tính <strong>theo tuần</strong> — nên ai cũng phải
            quy đổi qua lại. Công thức dựa trên tuần làm việc chuẩn <strong>38 giờ</strong> và năm <strong>52 tuần</strong>:
          </p>
          <ul>
            <li>Giờ → năm: lương giờ × số giờ/tuần × 52 (làm 38 giờ thì nhân 1.976)</li>
            <li>Năm → tuần: chia 52 · Năm → 2 tuần: chia 26 · Năm → tháng: chia 12</li>
            <li>Năm → giờ: chia (số giờ/tuần × 52)</li>
          </ul>
          <p>
            Phần trước thuế chỉ là phép nhân chia. Con số quan trọng — tiền thực vào tài khoản — phụ thuộc thuế thu
            nhập, Medicare levy và khoản trả HECS, tất cả tính trên thu nhập <em>cả năm</em> rồi chia đều vào từng kỳ
            lương. Công cụ phía trên làm sẵn việc đó.
          </p>

          <h2>Ví dụ theo các mức lương phổ biến</h2>
          <div className="example">
            <strong>$35/giờ, full-time 38 giờ</strong> (mức phổ biến ngành hospitality, warehouse có kinh nghiệm) —
            $1.330/tuần, $69.160/năm trước thuế. Sau thuế $11.268 và Medicare levy $1.383, thực nhận khoảng{' '}
            <strong>$56.509/năm</strong> — $1.087/tuần, tức $28,60/giờ sau thuế.
          </div>
          <div className="example">
            <strong>Lương văn phòng $80.000/năm</strong> — tương đương $40,49/giờ. Thực nhận sau thuế khoảng{' '}
            <strong>$63.880/năm</strong>: $1.228/tuần, $2.457 mỗi 2 tuần, $5.323/tháng.
          </div>
          <div className="example">
            <strong>$30/giờ, part-time 20 giờ/tuần</strong> (phổ biến với du học sinh) — $31.200/năm. Nhờ ngưỡng miễn
            thuế, LITO và giảm trừ Medicare levy cho thu nhập thấp, tổng thuế + levy chỉ khoảng $1.569 — thực nhận{' '}
            <strong>$29.631/năm</strong>, tức $570/tuần. Thu nhập càng thấp, tỷ lệ giữ lại càng cao.
          </div>

          <h2>Những bẫy lương người mới hay gặp</h2>
          <ul>
            <li>
              <strong>&quot;Package including super&quot; không phải lương của bạn:</strong> gói $88.000 gồm super
              nghĩa là lương gốc chỉ ~$78.571 (chia 1,12). Hỏi rõ trước khi ký.
            </li>
            <li>
              <strong>Lương casual cao hơn nhưng không hẳn &quot;hơn&quot;:</strong> đã gộp loading 25% bù cho không
              phép năm, không nghỉ ốm có lương, không đảm bảo giờ làm.
            </li>
            <li>
              <strong>Trả lương tiền mặt dưới mức award là bất hợp pháp</strong> — kiểm tra mức lương tối thiểu ngành
              của bạn trên fairwork.gov.au. Nhận cash không khai còn khiến bạn mất bằng chứng thu nhập khi vay ngân
              hàng, xin visa.
            </li>
            <li>
              <strong>Làm 2 job:</strong> chỉ khai tax-free threshold ở một job, nếu không cuối năm dễ bị nợ thuế
              ngược.
            </li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Muốn xem chi tiết thuế theo từng bậc, LITO và các ngưỡng HECS? Dùng{' '}
            <Link href="/vi/tinh-thue-thu-nhap-uc/">công cụ Tính Thuế Thu Nhập 2026–27</Link>.
          </p>

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính tham khảo — không phải tư vấn tài chính hay thuế. Số liệu giả định bạn là
            resident thuế, có một việc làm và khai tax-free threshold; chưa gồm các khoản giảm trừ, phụ phí khác. Đối
            chiếu với <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> hoặc tax agent có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
