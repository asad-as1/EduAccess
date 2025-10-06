import React, { useEffect, useState } from 'react';
import { Book, Calendar, Share2, FileText } from 'lucide-react';
import './Home.css';
import img0 from "../../img/img-0.jpg"
import img1 from "../../img/img-1.jpg"
import img2 from "../../img/img-2.jpg"
import img3 from "../../img/img-3.jpg"
import img4 from "../../img/img-4.jpg"
import img5 from "../../img/img-5.jpg"
import img6 from "../../img/img-6.jpg"
import img7 from "../../img/img-7.jpg"
import {Link} from "react-router-dom"
import Cookies from 'cookies-js';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const user = Cookies.get("user")
  const features = [
    {
      icon: <FileText />,
      title: "Smart Document Reader",
      description: "Advanced OCR technology with natural text-to-speech for visually impaired users. Upload any document and let our system read it aloud."
    },
    {
      icon: <Book />,
      title: "Study Materials Hub",
      description: "Access and upload comprehensive educational resources. Organized by subjects for easy navigation and learning."
    },
    {
      icon: <Calendar />,
      title: "AI-Powered Scheduler",
      description: "Create personalized study schedules that adapt to your learning patterns and goals automatically."
    },
    {
      icon: <Share2 />,
      title: "Collaborative Notes",
      description: "Share and collaborate on notes in real-time. Build a knowledge base with your peers."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* Animated Background */}
      {/* <div className="animated-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div> */}

      {/* Hero Section */}
      <section className="hero-section">
        {/* <Header /> Use Header component */}

        <div className="hero-content">
          <h1 className="hero-title">
            Learning Without
            <span className="gradient-text"> Boundaries</span>
          </h1>
          <p className="hero-subtitle">
            Experience education reimagined through innovative technology and accessibility
          </p>
          {/* <button className="cta-button"> */}
            {(!user && 
            <Link className='cta-button' to="/signup">Get Started</Link>)}
        </div>
        
      </section>

      <div className="oneone">
        <img src= {img2} alt="Document Reader" className="one" />
        </div>

      {/* Features Section */}
      <section className="features-section" id="features">
        <h2 className="section-title">Our Features</h2>

        <div className="features-carousel">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icons">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="carousel-indicators">
            {features.map((_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Two Divs Layout Section */}
      <section className="image-section">
        <div className="two-divs-container">
          <div className="two-divs">
            <div className="left">
              <img src= {img1} alt="Document Reader" className="image-left" />
            </div>
            <div className="right">
              <h3>TextReader</h3> 
              <p>Text reading powered by AI on webpages offers significant advantages, especially when it comes to accessibility and user engagement. AI-driven reading tools can convert written content into speech, providing valuable support for individuals with visual impairments or reading difficulties. This ensures that a wider audience can access and understand information without barriers. Furthermore, AI allows for a personalized reading experience, adjusting speed, voice tone, and even content summaries to suit individual preferences.</p>
              <p>This enhances user experience by making content easier to digest and retain, particularly for longer or more complex texts.</p>
            </div>
          </div>

         
          <div className="two-divs">
            <div className="right">
              <img src= {img6} alt="Document Reader" className="three" />
            </div>
            <div className="right">
              <img src= {img7} alt="Document Reader" className="three" />
            </div>
            <div className="right">
              <img src= {img4} alt="Document Reader" className="three" />
            </div>
          </div>


          <div className="two-divs">
          <div className="right">
              <h3>Summarization</h3>
              <p>The text summarization feature on our website is a powerful tool that helps users quickly extract key information from lengthy content. By providing concise summaries, this function allows learners to grasp the essential points of a topic without having to read through long passages.</p>
              <p>This not only saves time but also enhances understanding, especially when reviewing complex materials. Summarizing text also supports efficient studying by highlighting the most important concepts, making it easier for users to focus on what matters most.</p> 
            </div>
            <div className="right">
              <h3>Take A Test</h3> 
              <p>The "TakeATest" feature on our website is an essential tool for assessing how accurately and effectively users have learned the material. By offering quizzes and tests based on the content they've studied, learners can evaluate their understanding and identify areas for improvement.</p>
              <p>This interactive feature promotes active learning, helping users to reinforce key concepts and track their progress over time. It also boosts confidence by providing instant feedback, allowing learners to focus on topics that need further attention.</p>
            </div>
            <div className="right">
              <h3>Schedule</h3>
              <p>The "Schedule" feature on our website is a valuable tool for helping users organize their study schedules efficiently. By allowing learners to create personalized timetables, this feature encourages effective time management and ensures that study sessions are structured and balanced.</p>
              <p>It helps users allocate specific time slots for different subjects or tasks, promoting consistency and reducing procrastination. With a clear timetable, learners can stay on track, prioritize their workload, and achieve a better work-life balance.</p>
            </div>
          </div>


          <div className="two-divs">
            <div className="left">
              <img src= {img3} alt="Document Reader" className="image-left2" />
            </div>
            <div className="right">
              <img src= {img5} alt="Document Reader" className="image-left2" />
            </div>
          </div>
          <div className="two-divs">
          <div className="right">
              <h3>Ques & Ans</h3> 
              <p>The Question and Answer (Q&A) section of our website serves as a dynamic platform for learners to connect, share knowledge, and find solutions. Users can ask questions on any subject, and the community can provide helpful answers, fostering a collaborative learning environment. </p>
              <p>This feature empowers individuals to gain insights from diverse perspectives, encouraging active participation and peer-to-peer learning. Whether you're seeking clarity on a specific topic or sharing your expertise, the Q&A section promotes a supportive, engaging, and accessible educational experience for all.</p>
            </div>
            <div className="right">
              <h3>Study Notes</h3> 
              <p>The Study Notes section of our website is a valuable resource for learners to access organized, easy-to-understand materials on a variety of subjects. By providing well-structured notes, we aim to help students grasp complex topics more effectively, reinforcing their understanding and retention.</p>
              <p>This section not only allows users to review key concepts but also helps them prepare for exams and assignments with confidence. Sharing study notes creates a collaborative learning environment, where students can contribute and benefit from peer-driven resources.</p>
            </div>
          </div>


          <div className="two-divs reverse">
          <div className="right">
              <h3>My Notes</h3>
              <p>The "MyNotes" section of our website offers a personalized space where users can store and organize their own study materials. This feature allows learners to easily save important notes, ideas, and references for future use, creating a customized study resource library.By having a dedicated area for personal notes, users can quickly access their work, track their progress, and stay organized throughout their learning journey. </p>
              <p>This section enhances productivity by keeping everything in one place, making it easier to review and update notes as needed. It’s an essential tool for anyone looking to stay on top of their studies and keep their educational materials readily available.</p>
          </div>
            <div className="left">
              <img src={img0} alt="Study Materials" className="image-left" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="demo-section">
        <div className="demo-content">
          <div className="demo-text">
            <h2 className="section-title">See It In Action</h2>
            <p className="demo-description">
              Watch how our platform transforms the way you learn, collaborate, and grow.
              Experience seamless accessibility features and intuitive interface.
            </p>
            <div className="db">
              {
                (!user && 
                <Link to="/signup" className="demo-button">Sign Up Now</Link>
              )}
            </div>
          </div>
          <div className="demo-preview">
            <div className="preview-window">
              <div className="window-controls">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="preview-content">
                <div className="preview-animation"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
