import TaxRefundCalculator from '../../../components/TaxRefundCalculator';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tính Hoàn Thuế Ở Úc 2026 — Ước Tính Tax Return 2025–26',
  description:
    'Công cụ tính hoàn thuế Úc cho mùa khai thuế 2026 (năm thu nhập 2025–26): nhập thu nhập, deductions và thuế đã bị trừ để biết được hoàn hay phải đóng thêm. Kèm hướng dẫn khai thuế lần đầu cho người Việt.',
  alternates: {
    canonical: '/vi/tinh-hoan-thue-uc/',
    languages: {
      en: '/tax-refund-calculator/',
      vi: '/vi/tinh-hoan-thue-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Khai thuế tháng 7/2026 là khai cho năm nào?',
    a: 'Cho năm thu nhập 2025–26 (1/7/2025 – 30/6/2026) — dùng biểu thuế 2025–26 với bậc hai 16% và ngưỡng HECS $67.000. Mức 15% mới chỉ áp cho thu nhập từ 1/7/2026, thuộc tax return năm SAU. Công cụ này mặc định đúng năm 2025–26.',
  },
  {
    q: 'Khai thuế lần đầu cần chuẩn bị gì?',
    a: 'Ba thứ: (1) TFN — mã số thuế cá nhân; (2) tài khoản myGov đã liên kết với ATO; (3) chờ income statement chuyển trạng thái "Tax ready" trong myGov (thường cuối tháng 7) rồi khai qua myTax — lúc đó lương, thuế đã trừ, lãi bank tự điền sẵn, bạn chủ yếu kiểm tra và thêm deductions.',
  },
  {
    q: 'Hạn chót khai thuế là khi nào?',
    a: 'Tự khai qua myTax: hạn 31/10/2026. Nếu đăng ký với tax agent trước ngày đó, hạn được lùi (thường đến tháng 5 năm sau). Khai trễ mà không đăng ký agent có thể bị phạt — kể cả khi bạn thuộc diện được hoàn tiền.',
  },
  {
    q: 'Nên tự khai hay thuê tax agent?',
    a: 'Thu nhập đơn giản (chỉ lương + lãi bank, ít deductions) thì myTax tự khai được trong 30 phút, miễn phí. Nên dùng agent khi: có ABN/kinh doanh, đầu tư cổ phiếu hay nhà, năm đầu chưa rành, hoặc muốn chắc không sót deduction. Phí agent (~$80–200) được khấu trừ vào return năm sau. Lưu ý: agent hợp pháp phải có đăng ký tra được trên tpb.gov.au — cẩn thận "dịch vụ khai thuế" không giấy phép trong cộng đồng.',
  },
  {
    q: 'Làm nhiều job trong năm thì khai sao?',
    a: 'Income statement từ mọi job tự động đổ về myGov — bạn khai MỘT tax return duy nhất gộp hết. Đây cũng là lúc lộ ra chuyện khai tax-free threshold ở hai job: tổng thuế bị trừ sẽ thiếu so với thuế phải nộp, và phần thiếu thành hóa đơn.',
  },
  {
    q: 'Du học sinh về nước rồi có khai và nhận hoàn thuế được không?',
    a: 'Được. Nếu rời Úc hẳn trước 30/6, bạn có thể khai sớm (early lodgment), hoặc chờ khai online như thường từ 1/7. Tiền hoàn chuyển vào tài khoản bank Úc — nên giữ tài khoản mở đến khi nhận xong. Nhiều bạn về nước bỏ quên vài trăm đến cả nghìn đô tiền hoàn thuế và super — đừng nằm trong số đó.',
  },
  {
    q: 'Medicare levy surcharge là gì, tôi có bị không?',
    a: 'Ngoài Medicare levy 2% tiêu chuẩn, người độc thân thu nhập trên khoảng $101.000 (2025\u201326) mà KHÔNG có bảo hiểm bệnh viện tư phải đóng thêm 1\u20131,5% trên toàn bộ thu nhập \u2014 tức $1.500 ở mức $120.000. Rất nhiều người dính sau khi tăng lương mà quên mua bảo hiểm. Bỏ tick \u201cbảo hiểm bệnh viện tư\u201d trong tùy chọn nâng cao để xem mức phơi nhiễm; ngưỡng trên là cho người độc thân, gia đình có ngưỡng cao hơn.',
  },
  {
    q: 'Mới sang Úc giữa năm có được hưởng đủ ngưỡng miễn thuế $18.200 không?',
    a: 'Không \u2014 ngưỡng bị chia theo tỷ lệ: $13.464 cộng $4.736 \u00d7 số tháng là resident \u00f7 12. Sang tháng 1 thì ngưỡng năm 2025\u201326 chỉ khoảng $15.832. Chọn số tháng trong tùy chọn nâng cao \u2014 hầu hết calculator bỏ qua quy tắc này nên ước tính hoàn dư cho người mới đến, đến lúc nhận notice of assessment mới ngã ngửa.',
  },
  {
    q: 'Tôi có ít cổ phiếu ASX — cổ tức và franking credits ảnh hưởng gì đến tiền hoàn?',
    a: 'Cổ tức là thu nhập, nhưng cổ tức franked của công ty Úc đi kèm franking credits — phần thuế công ty đã nộp hộ. Cả cổ tức lẫn credits đều cộng vào thu nhập chịu thuế, sau đó TOÀN BỘ credits được hoàn lại như một khoản offset. Ở bậc thuế 30%, cổ tức fully franked gần như hòa; thu nhập thấp hơn thường được hoàn thêm. Nhập cả hai số từ dividend statement vào bảng chi tiết thu nhập.',
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
      <SiteHeader homeHref="/vi/" langHref="/tax-refund-calculator/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Mùa khai thuế 2026 · khai từ 1/7 đến 31/10</div>
          <h1>Tính Hoàn Thuế Ở Úc 2026</h1>
          <p>
            Ước tính tax return 2025–26 trước khi khai: nhập thu nhập, deductions và thuế đã bị trừ qua lương — biết
            ngay được hoàn bao nhiêu hay phải đóng thêm.
          </p>
        </section>

        <TaxRefundCalculator lang="vi" />

        <article className="content">
          <h2>Hoàn thuế thực chất là gì?</h2>
          <p>
            Suốt năm, chủ lao động trừ thuế qua từng kỳ lương theo bảng của ATO — chỉ là <em>ước tính chạy dọc năm</em>.
            Khi khai thuế, ATO tính thuế <em>thật</em> trên thu nhập chịu thuế (thu nhập trừ deductions), cộng Medicare
            levy và khoản trả HECS, rồi so với số đã trừ. <strong>Trừ dư → hoàn lại. Trừ thiếu → đóng thêm.</strong>{' '}
            Tiền hoàn không phải quà của chính phủ — là tiền của chính bạn quay về.
          </p>

          <div className="example">
            <strong>Sinh viên làm part-time: thu nhập $32.000, bị trừ $3.500</strong> — nhờ ngưỡng miễn thuế, LITO và
            giảm Medicare levy, thuế thật chỉ $1.986. Ước tính hoàn <strong>≈ $1.514</strong>. Thu nhập thấp mà có bị
            trừ thuế qua lương thường là nhóm được hoàn đậm nhất — đừng bỏ qua việc khai.
          </div>
          <div className="example">
            <strong>Lương $80.000, deductions $2.500</strong> — thu nhập chịu thuế $77.500, thuế thật $15.588; lương bị
            trừ theo mức $80.000 là ~$16.388 → hoàn <strong>≈ $800</strong>, đúng bằng deductions × 32% (thuế suất biên
            + Medicare).
          </div>

          <h2>Đúng năm mới đúng tiền: bẫy 16% vs 15%</h2>
          <p>
            Return khai trong tháng 7–10/2026 là cho năm <em>đã kết thúc</em> 30/6/2026 — phải dùng biểu{' '}
            <strong>2025–26</strong> (bậc hai <strong>16%</strong>, ngưỡng HECS $67.000). Mức thuế 15% đang được nhắc
            nhiều chỉ áp cho lương từ 1/7/2026 trở đi — thuộc return năm sau. Công cụ phía trên có bộ chọn năm và mặc
            định đúng 2025–26; các công cụ khác của Calcroo (tính lương, tính thuế hiện tại) dùng biểu 2026–27.
          </p>

          <h2>Hai “cú điều chỉnh thầm lặng”: surcharge và part-year</h2>
          <p>
            Hai khoản khiến nhiều người bất ngờ nhất mùa thuế: <strong>Medicare levy surcharge</strong> —
            thu nhập vượt ngưỡng mà không có bảo hiểm bệnh viện tư là đóng thêm 1–1,5% trên toàn bộ thu nhập;
            và <strong>ngưỡng miễn thuế part-year</strong> — đến hoặc rời Úc giữa năm thì ngưỡng $18.200 bị thu nhỏ
            theo tỷ lệ, nên người mới sang thường nợ thuế nhiều hơn calculator thông thường báo. Công cụ này tính cả
            hai — mở “tùy chọn nâng cao” để dùng.
          </p>

          <h2>Deductions người Việt hay bỏ sót</h2>
          <ul>
            <li><strong>Working-from-home:</strong> phương pháp fixed-rate tính theo giờ — cần ghi lại số giờ làm ở nhà (nhật ký, roster đều được). Bảng chi tiết deductions trong công cụ có sẵn ô nhập giờ, tự nhân hộ bạn.</li>
            <li><strong>Đồ nghề, đồng phục có logo và tiền giặt,</strong> phí công đoàn, phí hội nghề nghiệp.</li>
            <li><strong>Học nâng cao tay nghề</strong> gắn với việc hiện tại (RSA, chứng chỉ ngành...), di chuyển giữa hai nơi làm (không tính nhà ↔ chỗ làm).</li>
            <li><strong>Phí tax agent năm ngoái</strong> và từ thiện $2+ cho tổ chức có đăng ký DGR.</li>
          </ul>
          <p>
            Nguyên tắc một dòng: <em>tự bỏ tiền, phục vụ trực tiếp việc kiếm thu nhập, có bằng chứng</em>. Khai khống
            là đường ngắn nhất biến tiền hoàn thành cuộc audit — ATO đối chiếu dữ liệu rất rộng.
          </p>

          <h2>Lịch mùa thuế 2026</h2>
          <ul>
            <li><strong>1/7/2026:</strong> myTax mở khai cho năm 2025–26.</li>
            <li><strong>Cuối tháng 7:</strong> income statement chuyển "Tax ready", dữ liệu tự điền đổ về. Khai trước mốc này dễ phải sửa lại.</li>
            <li><strong>31/10/2026:</strong> hạn tự khai, hoặc hạn đăng ký với tax agent để được lùi hạn.</li>
            <li><strong>Tiền hoàn:</strong> thường về tài khoản trong ~2 tuần sau khi khai online.</li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Muốn ước tính cho năm mới 2026–27? Chuyển bộ chọn năm trong công cụ, hoặc xem payslip hiện tại bằng{' '}
            <Link href="/vi/tinh-thue-thu-nhap-uc/">Tính Thuế Thu Nhập</Link> và{' '}
            <Link href="/vi/tinh-tra-no-hecs/">Tính Trả Nợ HECS</Link>.
          </p>

          <p className="disclaimer">
            Calcroo chỉ cung cấp ước tính tham khảo — không phải tư vấn thuế và không thay thế notice of assessment của
            ATO. Ước tính dùng ngưỡng Medicare levy surcharge cho người độc thân (gia đình có ngưỡng riêng) và chưa gồm điều chỉnh bảo hiểm y tế tư nhân, capital gains và các khoản giảm trừ khác. Khai chính thức qua myGov/myTax hoặc tax agent có đăng ký; đối chiếu tại{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a>.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
