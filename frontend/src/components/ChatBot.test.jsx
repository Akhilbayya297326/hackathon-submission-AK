import { render, screen, fireEvent } from '@testing-library/react';
import ChatBot from './ChatBot';

describe('ChatBot Component', () => {
    it('renders the welcome message successfully', () => {
        render(<ChatBot />);
        const welcomeText = screen.getByText(/Namaste! I am your Smart Bharat AI assistant/i);
        expect(welcomeText).toBeInTheDocument();
    });

    it('contains essential accessibility ARIA labels', () => {
        render(<ChatBot />);
        const chatRegion = screen.getByRole('log');
        expect(chatRegion).toHaveAttribute('aria-live', 'polite');

        const inputField = screen.getByLabelText(/Type your message/i);
        expect(inputField).toBeInTheDocument();
    });

    it('updates input field on user typing', () => {
        render(<ChatBot />);
        const inputField = screen.getByLabelText(/Type your message/i);
        fireEvent.change(inputField, { target: { value: 'How do I apply for a PAN card?' } });
        expect(inputField.value).toBe('How do I apply for a PAN card?');
    });
});