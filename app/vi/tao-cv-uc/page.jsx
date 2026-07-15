import CvBuilder from '../../../components/CvBuilder';
import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tạo CV Chuẩn Úc Online — Miễn Phí, Thân Thiện ATS',
  description:
    'Tạo CV đúng chuẩn Úc miễn phí ngay trên trình duyệt: không ảnh, không ngày sinh, bố cục một cột thân thiện ATS, xuất PDF chữ thật. Tự lưu trên máy bạn — không upload đi đâu.',
  alternates: {
    canonical: '/vi/tao-cv-uc/',
    languages: {
      en: '/cv-builder/',
      vi: '/vi/tao-cv-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Vì sao CV Úc không có ảnh và ngày sinh?',
    a: 'Chuẩn tuyển dụng Úc — định hình bởi luật chống phân biệt đối xử — không đưa ảnh, ngày sinh, tình trạng hôn nhân hay quốc tịch vào CV. Để những thứ đó vào là hồ sơ lộ ngay dấu "người mới, chưa hiểu văn hóa địa phương". Địa chỉ cũng chỉ cần suburb và bang, không cần số nhà tên đường.',
  },
  {
    q: 'CV Úc nên dài mấy trang?',
    a: 'Hai trang là chuẩn vàng với đa số; ba trang chấp nhận được cho người nhiều kinh nghiệm. Sinh viên và việc đầu tiên: một trang. Nhà tuyển dụng lướt hồ sơ dưới một phút ở vòng đầu — cắt bớt việc cũ, ít liên quan trước.',
  },
  {
    q: 'ATS-friendly nghĩa là gì?',
    a: 'Applicant Tracking System là phần mềm đọc CV của bạn TRƯỚC khi con người thấy nó. Nó đọc tốt chữ thật, một cột, tiêu đề mục chuẩn — và tắc nghẹn với bố cục hai cột, text box, đồ họa, và CV xuất dạng ảnh. Công cụ này tạo đúng loại nó đọc trơn: một cột, tiêu đề chuẩn, PDF chữ thật.',
  },
  {
    q: 'Kinh nghiệm làm việc ở Việt Nam có nên đưa vào không?',
    a: 'Có, nếu liên quan đến việc đang xin — viết tên công ty kèm mô tả ngắn nếu nhà tuyển dụng Úc không biết ("FPT Software — one of Vietnam\'s largest IT companies"), quy đổi thành tích ra con số. Bằng cấp Việt Nam ghi kèm tên tiếng Anh; một số ngành cần thẩm định bằng qua các dịch vụ như VETASSESS — đó là chuyện của hồ sơ visa/nghề, còn trên CV chỉ cần ghi trung thực.',
  },
  {
    q: 'Dữ liệu CV của tôi có bị upload không?',
    a: 'Không. Mọi thứ bạn gõ tự lưu vào trình duyệt của chính bạn (localStorage) để lần sau mở lại làm tiếp trên cùng thiết bị — nhưng không bao giờ rời khỏi máy. Muốn xóa sạch thì bấm nút xóa trong công cụ.',
  },
  {
    q: 'Lấy file PDF như thế nào?',
    a: 'Bấm Tải PDF rồi chọn "Save as PDF" trong hộp thoại in của trình duyệt. Kết quả là chữ thật chọn-copy được — không phải ảnh chụp — đúng khổ A4 với lề chuẩn. Đặt tên file chuyên nghiệp: Ten-Ho-Resume.pdf.',
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
      <SiteHeader homeHref="/vi/" langHref="/cv-builder/" langLabel="English" />
      <main className="wrap">
        <section className="hero no-print">
          <div className="fy-chip">Miễn phí · thân thiện ATS · chuẩn Úc</div>
          <h1>Tạo CV Chuẩn Úc Online</h1>
          <p>
            Tạo CV sạch sẽ đúng chuẩn Úc — không ảnh, không ngày sinh, PDF chữ thật cho máy lọc hồ sơ đọc được. Tự lưu
            trên trình duyệt; không có gì được upload.
          </p>
        </section>

        <CvBuilder lang="vi" />

        <article className="content no-print">
          <h2>&quot;Chuẩn Úc&quot; khác CV kiểu Việt Nam ở đâu?</h2>
          <p>
            Ba thói quen cần bỏ ngay. <strong>Không ảnh, không ngày sinh, không thông tin cá nhân</strong> kiểu tình
            trạng hôn nhân — chuẩn chống phân biệt đối xử của Úc giữ chúng ngoài trang giấy, và để vào là hồ sơ bị
            nhận diện &quot;người chưa hiểu luật chơi&quot; ngay dòng đầu. <strong>Thành tích thay vì nhiệm vụ</strong>:
            mỗi gạch đầu dòng bắt đầu bằng động từ và có kết quả đo được (&quot;Phục vụ 60+ đơn mỗi ca, không lệch
            kho&quot; ăn đứt &quot;chịu trách nhiệm về đơn hàng&quot;). Và <strong>người tham chiếu không liệt kê
            sẵn</strong> — &quot;available on request&quot; là chuẩn.
          </p>

          <h2>Qua được robot mới gặp được người</h2>
          <p>
            Đa số công ty vừa và lớn cho CV chạy qua ATS trước. Hệ thống này thưởng đúng thứ công cụ tạo ra: một cột,
            tiêu đề mục chuẩn, chữ thật (tuyệt đối không xuất dạng ảnh), gạch đầu dòng đơn giản. Nó cũng thưởng{' '}
            <strong>từ khóa lấy từ tin tuyển dụng</strong> — chép đúng thuật ngữ kỹ năng, phần mềm trong tin đăng vào
            bullets và dòng kỹ năng của bạn. Công cụ phía trên có mục "So khớp với tin tuyển dụng": dán tin vào, nó
            kiểm tra CV của bạn đã có từ khóa nào, còn thiếu từ nào. Chỉnh summary và vài bullet đầu cho từng đơn mất
            5 phút, nhân đôi tỷ lệ được gọi.
          </p>

          <h2>Công thức bullet ăn điểm</h2>
          <p>
            <em>Động từ + việc đã làm + kết quả đo được.</em> Managed, built, reduced, trained, resolved, increased.
            Con số làm lời khai đáng tin: số người trong team, số đơn mỗi ca, phần trăm, số tiền. Việc casual hay
            hospitality cũng đầy con số — số bàn mỗi ca, két cân đúng, số nhân viên đã đào tạo.
          </p>

          <h2>Câu hỏi thường gặp</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Nhận việc rồi? Tính lương thực nhận với <Link href="/vi/tinh-luong-uc/">Tính Lương</Link>, hoặc so offer
            casual bằng <Link href="/vi/tinh-luong-casual/">Tính Lương Casual</Link>.
          </p>

          <p className="disclaimer">
            Hướng dẫn chung theo quy ước CV phổ biến tại Úc — kỳ vọng khác nhau theo ngành và nhà tuyển dụng, hãy làm
            theo yêu cầu cụ thể của từng đơn. Dữ liệu CV chỉ lưu trong trình duyệt của bạn, không bao giờ gửi về
            Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter vi />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
