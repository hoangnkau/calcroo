import { SiteHeader, SiteFooter } from '../../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Hướng Dẫn Khai Thuế Úc 2026 Cho Người Mới — Từng Bước Trên myTax',
  description:
    'Khai thuế Úc 2026 (năm thu nhập 2025–26) từ A đến Z cho người Việt: mốc thời gian, chuẩn bị giấy tờ, 7 bước trên myTax, deductions hay bỏ sót, HECS năm nay có gì mới và bao lâu nhận tiền hoàn.',
  alternates: {
    canonical: '/vi/huong-dan/khai-thue-uc-2026/',
    languages: {
      en: '/guides/tax-return-2026-australia/',
      vi: '/vi/huong-dan/khai-thue-uc-2026/',
    },
  },
};

const FAQ = [
  {
    q: 'Hạn chót khai thuế 2026 là khi nào?',
    a: 'Tự khai qua myTax: 31/10/2026. Đăng ký với tax agent trước ngày đó thì hạn được lùi, thường đến tháng 5/2027. Khai trễ mà không có agent có thể bị phạt failure-to-lodge — kể cả khi bạn thuộc diện được hoàn tiền.',
  },
  {
    q: 'Bao lâu thì nhận được tiền hoàn?',
    a: 'Khai online thường được xử lý trong khoảng 2 tuần, tiền về tài khoản ngân hàng bạn khai trong return. Hồ sơ phức tạp, số liệu lệch với dữ liệu ATO, hoặc còn nợ cũ (thuế, Centrelink) sẽ chậm hơn — theo dõi tiến độ trong mục ATO trên myGov.',
  },
  {
    q: 'Thu nhập dưới $18.200 có phải khai không?',
    a: 'Nếu từng bị trừ thuế qua lương — rất phổ biến với casual và part-time — thì NÊN khai: phần thuế đã trừ thường được hoàn lại toàn bộ. Nếu thật sự không bị trừ đồng nào và không có nghĩa vụ khai, hãy nộp "non-lodgment advice" qua myGov để ATO không truy hỏi.',
  },
  {
    q: 'Chưa có myGov thì bắt đầu từ đâu?',
    a: 'Tạo tài khoản tại my.gov.au bằng email, rồi liên kết với ATO (cần TFN và trả lời vài câu xác minh danh tính — bank account nhận lương, payslip cũ). Liên kết một lần, các năm sau chỉ việc đăng nhập. Kẹt ở bước xác minh có thể gọi ATO 13 28 61.',
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
      <SiteHeader homeHref="/vi/" langHref="/guides/tax-return-2026-australia/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Hướng dẫn · mùa thuế 2026</div>
          <h1>Hướng Dẫn Khai Thuế Úc 2026 Cho Người Mới</h1>
          <p>
            Năm thu nhập 2025–26 vừa kết thúc ngày 30/6. Toàn bộ quy trình — mốc thời gian, giấy tờ, 7 bước trên myTax,
            bao lâu nhận tiền — gói trong một trang, viết cho người khai lần đầu.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>Lịch mùa thuế 2026</h2>
          <ul>
            <li><strong>1/7/2026</strong> — myTax mở khai cho năm 2025–26.</li>
            <li><strong>14/7/2026</strong> — hạn chủ lao động chốt income statement của bạn.</li>
            <li><strong>Giữa–cuối tháng 7</strong> — income statement chuyển &quot;Tax ready&quot;, lãi bank và bảo hiểm y tế tự điền. Thời điểm khôn ngoan để khai bắt đầu từ đây.</li>
            <li><strong>31/10/2026</strong> — hạn tự khai, đồng thời là hạn cuối đăng ký tax agent để được lùi hạn.</li>
          </ul>

          <h2>Chuẩn bị gì trước khi khai</h2>
          <p>
            Tài khoản <strong>myGov đã liên kết ATO</strong> lo giúp bạn phần lớn: income statement từ mọi chỗ làm,
            lãi ngân hàng, bảo hiểm y tế tự chảy vào. Thứ ATO không điền hộ được là phía của bạn —{' '}
            <strong>bằng chứng deductions</strong>: số giờ working-from-home (nhật ký hay roster đều được), hóa đơn
            dụng cụ, đồng phục, khóa học nghề, biên nhận từ thiện, phí tax agent năm ngoái. Người Việt mới sang hay
            thiếu đúng khoản này — từ giờ tạo một album ảnh &quot;Tax 2026-27&quot; trong điện thoại, chụp mọi hóa đơn
            liên quan công việc là xong chuyện năm sau.
          </p>

          <h2>7 bước trên myTax</h2>
          <ol>
            <li>Đăng nhập myGov → Australian Taxation Office → <em>Lodge your tax return</em>.</li>
            <li>Kiểm tra thông tin liên lạc và <strong>số tài khoản ngân hàng</strong> — tiền hoàn về đúng tài khoản này.</li>
            <li>Soát thu nhập tự điền: đủ mọi job chưa, lãi bank đúng chưa. Tự thêm phần ATO không thấy: thu nhập ABN, tiền mặt.</li>
            <li>Nhập deductions theo từng mục. Khai đúng và có bằng chứng — khai khống chi phí công việc là mồi audit ưa thích của ATO.</li>
            <li>Trả lời phần Medicare và bảo hiểm y tế tư — Medicare levy surcharge được tính ở đây.</li>
            <li>Xem màn hình ước tính. Con số nên gần với kết quả từ <Link href="/vi/tinh-hoan-thue-uc/">công cụ Tính Hoàn Thuế</Link> nếu bạn nhập cùng dữ liệu.</li>
            <li>Submit. Nhận biên nhận ngay, và notice of assessment sau khoảng 2 tuần.</li>
          </ol>

          <h2>Năm nay có gì khác</h2>
          <p>
            Hai điều khiến return 2026 đặc biệt. Một: đây là return đầu tiên trọn vẹn theo{' '}
            <strong>hệ thống trả HECS lũy tiến</strong> — nhiều chủ lao động trừ dư trong nửa đầu năm 2025–26 khi bảng
            khấu trừ chưa kịp đổi, phần dư đó về lại với bạn qua lần quyết toán này (
            <Link href="/vi/tinh-tra-no-hecs/">công cụ HECS</Link> cho biết khoản trả đúng). Hai: đợt{' '}
            <strong>xóa 20% dư nợ HELP</strong> đã được áp trong năm — không đổi tiền hoàn của bạn, nhưng hãy mở myGov
            xem số dư nợ đã giảm đúng chưa.
          </p>
          <p>
            Và nhớ bẫy chọn năm: return khai bây giờ dùng biểu <strong>2025–26</strong> — bậc 16%, ngưỡng HECS $67.000.
            Mức 15% đang được bàn tán chỉ áp cho lương từ 1/7/2026, thuộc return <em>năm sau</em>.
          </p>

          <h2>Tự khai hay thuê tax agent?</h2>
          <p>
            Hồ sơ đơn giản — chỉ lương, lãi bank, deductions cơ bản — myTax làm xong dưới một giờ, miễn phí, và giao
            diện có thể dịch bằng Google Translate nếu ngại tiếng Anh. Agent đáng đồng tiền ($80–200, được khấu trừ
            năm sau) khi bạn có ABN, đầu tư, năm đầu chưa rành, hoặc năm lộn xộn (nhiều job, sang Úc giữa năm — nhớ
            ngưỡng miễn thuế part-year). Agent hợp pháp phải tra được trên tpb.gov.au — cẩn thận &quot;dịch vụ khai
            thuế giá rẻ&quot; không giấy phép trong cộng đồng: sai sót họ làm, ATO gõ cửa bạn.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Trước khi khai, ước tính kết quả bằng <Link href="/vi/tinh-hoan-thue-uc/">Tính Hoàn Thuế</Link> — thu
            nhập, deductions, HECS và Medicare levy surcharge, đúng biểu 2025–26.
          </p>

          <p className="disclaimer">
            Thông tin chung, không phải tư vấn thuế — hoàn cảnh mỗi người mỗi khác. Mốc thời gian và quy trình theo
            công bố cho mùa thuế 2026; xác nhận chi tiết hiện hành tại{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> hoặc với tax agent có đăng ký.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
