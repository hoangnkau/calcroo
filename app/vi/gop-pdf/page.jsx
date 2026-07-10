import PdfMerger from '../../../components/PdfMerger';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Gộp PDF Online — Ghép PDF & Ảnh Thành Một File, Miễn Phí & Riêng Tư',
  description:
    'Gộp PDF và ảnh chụp giấy tờ thành một file PDF duy nhất để nộp hồ sơ vay, visa, thuê nhà — miễn phí ngay trên trình duyệt. Sắp xếp thứ tự trang, ảnh tự lên khổ A4, không upload đi đâu.',
  alternates: {
    canonical: '/vi/gop-pdf/',
    languages: {
      en: '/pdf-merger/',
      vi: '/vi/gop-pdf/',
    },
  },
};

const FAQ = [
  {
    q: 'Gộp payslip thành một PDF để nộp hồ sơ vay như thế nào?',
    a: 'Thêm từng payslip vào — PDF tải từ cổng lương, hoặc ảnh chụp bản giấy — sắp mới nhất lên đầu (hoặc theo đúng thứ tự broker yêu cầu), rồi bấm Gộp. Ảnh tự động lên trang A4 sạch sẽ. Ngân hàng và broker thường cần 2–3 payslip gần nhất trong MỘT file đính kèm — đúng thứ công cụ này tạo ra.',
  },
  {
    q: 'Giấy tờ của tôi có bị upload lên server không?',
    a: 'Không. Việc gộp chạy hoàn toàn trong trình duyệt bằng thư viện pdf-lib — payslip, sao kê, hộ chiếu của bạn không rời khỏi máy. Đây là loại giấy tờ nhạy cảm nhất bạn có; không việc gì phải đưa chúng qua server của một trang web lạ chỉ để bấm ghim.',
  },
  {
    q: 'Trộn PDF và ảnh trong cùng một lần gộp được không?',
    a: 'Được — đó chính là kịch bản chính. Sao kê ngân hàng tải về là PDF, còn giấy tờ bản cứng thì chụp ảnh; thêm cả hai, sắp thứ tự bằng mũi tên, mỗi ảnh thành một trang A4 căn giữa trong file cuối. Chọn chất lượng Vừa để cân bằng dung lượng và độ nét.',
  },
  {
    q: 'Vì sao báo file có mật khẩu?',
    a: 'Một số sao kê ngân hàng được mã hóa bằng ngày sinh hoặc số tài khoản của bạn. Trình duyệt không gộp được PDF có mật khẩu. Cách xử lý: mở file, nhập mật khẩu, rồi Print → “Save as PDF” để tạo bản không khóa, và gộp bản đó.',
  },
  {
    q: 'Có giới hạn số trang hay dung lượng không?',
    a: 'Chỉ giới hạn bởi bộ nhớ máy bạn — vài chục trang, tổng vài trăm MB vẫn chạy tốt trên điện thoại/laptop đời mới. Nếu file gộp xong vẫn quá nặng so với cổng nộp: nén ảnh trước bằng công cụ Nén Ảnh Giấy Tờ, hoặc chọn chất lượng Gọn.',
  },
  {
    q: 'Nén một file PDF scan sẵn có được không?',
    a: 'Chưa — nén PDF scan đúng nghĩa phải render lại từng trang, là công cụ nặng hơn có thể bổ sung sau. Cách hiệu quả hiện tại là xử lý từ đầu nguồn: nén ảnh bằng công cụ Nén Ảnh Giấy Tờ trước khi gộp, và chọn chất lượng Gọn ở đây.',
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
      <SiteHeader homeHref="/vi/" langHref="/pdf-merger/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · file không rời máy bạn</div>
          <h1>Gộp PDF Online</h1>
          <p>
            Ghép PDF và ảnh chụp giấy tờ thành một file gọn gàng để nộp hồ sơ vay, visa, thuê nhà — miễn phí trên trình
            duyệt, giấy tờ của bạn không chạm đến bất kỳ server nào.
          </p>
        </section>

        <PdfMerger lang="vi" />

        <article className="content">
          <h2>Một hồ sơ, một file</h2>
          <p>
            Hồ sơ nghiêm túc nào — vay mua nhà, visa, thuê nhà — cũng kết thúc bằng cùng một yêu cầu: <em>đính kèm giấy
            tờ thành một file PDF duy nhất</em>. Còn thứ bạn đang có là một thư mục lộn xộn: sao kê PDF, payslip tải
            về, ảnh chụp giấy tờ bản cứng. Công cụ này ghim chúng lại tử tế: PDF giữ nguyên chất lượng từng trang, ảnh
            lên trang A4 căn giữa, và mũi tên cho bạn xếp đúng thứ tự người xét hồ sơ yêu cầu.
          </p>

          <h2>Riêng tư — ở đây nó không phải khẩu hiệu</h2>
          <p>
            Nghĩ xem trong một lần gộp có gì: payslip lộ lương, sao kê lộ chi tiêu, hộ chiếu của bạn. Các trang gộp PDF
            phổ biến xử lý file trên server của họ — tức bạn giao trọn danh tính tài chính cho một công ty chưa từng
            nghe tên, chỉ để tiết kiệm một cú bấm ghim. Calcroo gộp bằng <strong>pdf-lib chạy ngay trong trình duyệt</strong>:
            trang load xong bạn ngắt mạng nó vẫn chạy, vì không có gì được gửi đi đâu cả.
          </p>

          <h2>Thứ tự file là thứ người xét hồ sơ để ý</h2>
          <ul>
            <li><strong>Vay mua nhà:</strong> payslip mới nhất lên đầu, rồi sao kê theo từng tài khoản, rồi ID — hoặc đúng theo checklist của broker.</li>
            <li><strong>Visa:</strong> theo đúng thứ tự danh mục giấy tờ trong ImmiAccount; người xét duyệt đọc từ trên xuống.</li>
            <li><strong>Thuê nhà:</strong> thư ngỏ, ID, chứng minh thu nhập, người tham chiếu — giúp property manager lướt hồ sơ dễ nhất có thể.</li>
          </ul>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Trọn bộ đồ nghề làm hồ sơ: chỉnh ảnh với <Link href="/vi/chinh-anh-visa-uc/">Chỉnh Ảnh Visa</Link>, nén
            scan nặng với <Link href="/vi/nen-anh-giay-to/">Nén Ảnh Giấy Tờ</Link>, và soát phần tiền bạc với{' '}
            <Link href="/vi/tinh-thue-thu-nhap-uc/">Tính Thuế Thu Nhập</Link>.
          </p>

          <p className="disclaimer">
            Calcroo gộp file để hỗ trợ người dùng — luôn làm theo yêu cầu về định dạng, thứ tự và dung lượng trong
            chính hồ sơ của bạn. File xử lý ngay trên trình duyệt, không bao giờ được upload lên Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
