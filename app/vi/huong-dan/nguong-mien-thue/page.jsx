import { SiteHeader, SiteFooter } from '../../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Ngưỡng Miễn Thuế $18.200 Là Gì — Ai Được, Khai Ở Đâu, Bẫy Nào?',
  description:
    'Ngưỡng miễn thuế $18.200 ở Úc năm 2026–27 nói cho dễ hiểu: tick ở job nào, vì sao thực tế không đóng thuế đến tận ~$22.860, quy tắc part-year cho người mới sang, và working holiday có được không.',
  alternates: {
    canonical: '/vi/huong-dan/nguong-mien-thue/',
    languages: { en: '/guides/tax-free-threshold/', vi: '/vi/huong-dan/nguong-mien-thue/' },
  },
};

const FAQ = [
  {
    q: 'Thu nhập dưới $18.200 có phải đóng thuế không?',
    a: 'Không đóng thuế thu nhập — và nhờ Low Income Tax Offset, sàn không-thuế thực tế còn cao hơn: khoảng $22.860 năm 2026–27 mới bắt đầu phải đóng, còn Medicare levy chỉ tính từ trên $28.011. Nhưng nếu chỗ làm đã trừ thuế qua lương trong năm, bạn PHẢI khai thuế để lấy lại phần đó.',
  },
  {
    q: 'Có nên tick “claim the tax-free threshold” trên tờ khai TFN không?',
    a: 'Có — ở job chính (job trả nhiều nhất). Tick nghĩa là chỗ làm đó trừ thuế ít hơn mỗi kỳ lương. Job thứ hai thì KHÔNG tick, nếu không cả hai nơi đều trừ thiếu và phần thiếu thành hóa đơn cuối năm.',
  },
  {
    q: 'Mới sang Úc giữa năm có được đủ $18.200 không?',
    a: 'Không. Người resident một phần năm chỉ được $13.464 cộng $4.736 × số tháng ÷ 12. Sang tháng 1 thì ngưỡng năm đó chỉ khoảng $15.832. Công cụ Tính Hoàn Thuế của Calcroo có ô chọn số tháng resident, tự áp quy tắc này.',
  },
  {
    q: 'Working holiday (visa 417/462) có được ngưỡng miễn thuế không?',
    a: 'Thường là không — đa số working holiday maker bị đánh thuế 15% từ đồng đầu tiên theo biểu riêng, bất kể ngưỡng. Tình trạng residency và loại visa thay đổi kết quả, nên kiểm tra trường hợp cụ thể của bạn với ATO.',
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
      <SiteHeader homeHref="/vi/" langHref="/guides/tax-free-threshold/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Hướng dẫn · 2026–27</div>
          <h1>Ngưỡng Miễn Thuế $18.200, Nói Cho Dễ Hiểu</h1>
          <p>
            $18.200 đầu tiên mỗi năm không bị đánh thuế — nhưng tick ở đâu, tick mấy chỗ, và sang Úc giữa năm thì sao
            mới là chỗ người ta vấp.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>Nó thực chất là gì</h2>
          <p>
            Resident thuế của Úc <strong>không đóng thuế thu nhập trên $18.200 đầu tiên</strong> mỗi năm tài chính. Nó
            nằm sẵn trong biểu thuế, không phải thứ phải xin hàng năm. Thứ bạn <em>kiểm soát</em> là tờ khai{' '}
            <strong>TFN declaration</strong> khi nhận việc: tick ô &quot;claim the tax-free threshold&quot; để chỗ làm
            đó trừ thuế như thể $18.200 đầu của bạn miễn thuế — mỗi kỳ lương cầm về nhiều hơn.
          </p>

          <h2>Sàn không-thuế thật cao hơn $18.200</h2>
          <p>
            Hai trợ thủ thầm lặng đẩy sàn lên. <strong>Low Income Tax Offset</strong> (tối đa $700) xóa sạch thuế cho
            đến khoảng <strong>$22.860</strong> năm 2026–27. Còn <strong>Medicare levy</strong> có ngưỡng riêng —
            dưới <strong>$28.011</strong> (độc thân) không phải đóng đồng nào. Nghĩa là sinh viên làm thêm kiếm
            $22.000: thuế đúng bằng 0 — và nếu chỗ làm có trừ thuế qua lương, khai thuế là lấy lại đủ. Tự kiểm tra
            con số của bạn bằng <Link href="/vi/tinh-thue-thu-nhap-uc/">Tính Thuế Thu Nhập</Link>.
          </p>

          <h2>Một job tick. Chỉ một.</h2>
          <p>
            Ngưỡng thuộc về <em>bạn</em>, không thuộc về từng job — tick ở job trả cao nhất, mọi chỗ khác để trống.
            Tick ở hai job là nguyên nhân số một của hóa đơn thuế bất ngờ: cả hai nơi trừ như thể mình là nguồn thu
            duy nhất, tổng trừ bị thiếu, và ATO đòi phần chênh khi quyết toán. Đang làm hai job? Đọc tiếp{' '}
            <Link href="/vi/huong-dan/lam-2-job-thue/">bài làm 2 job thuế tính sao</Link>.
          </p>

          <h2>Sang hoặc rời Úc giữa năm: ngưỡng co lại</h2>
          <p>
            $18.200 trọn vẹn dành cho người resident đủ 12 tháng. Người mới sang được ngưỡng theo tỷ lệ:{' '}
            <strong>$13.464 + $4.736 × số tháng ÷ 12</strong>. Đặt chân tháng 1 thì ngưỡng năm đầu chỉ ~$15.832 — chi
            tiết mà đa số calculator bỏ qua, và người mới di cư phát hiện ra dưới dạng một hóa đơn.{' '}
            <Link href="/vi/tinh-hoan-thue-uc/">Tính Hoàn Thuế</Link> có sẵn ô chọn số tháng cho đúng trường hợp này.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            Thông tin chung theo biểu thuế resident 2026–27 đã công bố — không phải tư vấn thuế. Residency và loại
            visa thay đổi kết quả; xác nhận tại <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> hoặc
            với tax agent có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
