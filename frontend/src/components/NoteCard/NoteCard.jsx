import React from 'react';
import { FileText, User, UserCircle, ArrowRight } from 'lucide-react';
import "./NoteCard.css"
import { Link } from 'react-router-dom';

const NoteCard = ({ id, title, shortNote, author, role }) => {
  return (
    <div className="note-card-container">
      {/* Header */}
      <div className="note-card-header">
        <div className="">
        <FileText className="note-card-icon" />
        </div>
        <h3 className="note-card-title">{title}</h3>
      </div>

      {/* Content */}
      <p className="note-card-short-note">{shortNote}</p>

      {/* Author Info (for admin) */}
      {role === 'admin' && author && (
        <div className="note-card-author-info">
          <div className="note-card-author-detail">
            <User className="note-card-icon-small" />
            <span>{author.fullName} ({author.username})</span>
          </div>
          <div className="note-card-author-detail">
            <UserCircle className="note-card-icon-small" />
            <span>Role: {author.role}</span>
          </div>
        </div>
      )}

      {/* View Button */}
      <div className="lr">

      <Link to={`/mynotes/${id}`} className="note-card-view-button">
        <span>View File</span>
        <ArrowRight className="note-card-icon-small" />
      </Link>
      </div>
    </div>
  );
};

export default NoteCard;
