
export default function Footer() {
    const prePreparedMsg = `ביוטי סנטר שלום.%20אשמח לפנות אליכם בנוגע ל`
    return (
        <footer className="footer">
            <div className="footer-icons">
                <div className="footer-element">
                    <i className="fas fa-map-marker-alt footer-btn"></i>
                    <span className="caption">Location</span>
                </div>
                <div className="footer-element">
                    <i className="fab fa-whatsapp footer-btn">
                        <a href={`https://wa.me/972548167256?text=${prePreparedMsg}`} target="blank"></a>
                    </i>
                    <span className="caption">054-816-7256</span>
                </div>
            </div>
            {/* <span className="copyrights">&copy; Beauty-Center, 2023 </span> */}
        </footer>
    )
}
